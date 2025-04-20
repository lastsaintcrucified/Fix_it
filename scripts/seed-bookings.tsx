/**
 * This script seeds the Firebase database with sample bookings
 * Run with: npx tsx scripts/seed-bookings.tsx
 */

import { initializeApp } from "firebase/app";
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample clients
const clients = [
	{ id: "client1", name: "Emma Thompson", email: "emma.thompson@example.com" },
	{ id: "client2", name: "Robert Chen", email: "robert.chen@example.com" },
	{
		id: "client3",
		name: "Olivia Martinez",
		email: "olivia.martinez@example.com",
	},
	{ id: "client4", name: "James Wilson", email: "james.wilson@example.com" },
	{ id: "client5", name: "Sophia Davis", email: "sophia.davis@example.com" },
];

// Booking statuses
const statuses = ["pending", "confirmed", "completed", "cancelled"];

// Function to get a random item from an array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRandomItem(array: any[]) {
	return array[Math.floor(Math.random() * array.length)];
}

// Function to get a random future date within the next 30 days
function getRandomFutureDate() {
	const now = new Date();
	const futureDate = new Date(now);
	futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
	return futureDate;
}

// Function to get a random past date within the last 30 days
function getRandomPastDate() {
	const now = new Date();
	const pastDate = new Date(now);
	pastDate.setDate(now.getDate() - Math.floor(Math.random() * 30) - 1);
	return pastDate;
}

// Function to seed the database with bookings
async function seedBookings() {
	console.log("Starting to seed bookings...");

	try {
		// Get all services from the database
		const servicesSnapshot = await getDocs(collection(db, "services"));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const services: any[] = [];
		servicesSnapshot.forEach((doc) => {
			services.push({ id: doc.id, ...doc.data() });
		});

		// Create 3-5 bookings for each service
		for (const service of services) {
			const numBookings = Math.floor(Math.random() * 3) + 3; // 3 to 5 bookings per service

			for (let i = 0; i < numBookings; i++) {
				const client = getRandomItem(clients);
				const status = getRandomItem(statuses);

				// For completed or cancelled bookings, use a past date
				// For pending or confirmed bookings, use a future date
				const bookingDate =
					status === "completed" || status === "cancelled"
						? getRandomPastDate()
						: getRandomFutureDate();

				// Add booking to the database
				await addDoc(collection(db, "bookings"), {
					serviceId: service.id,
					serviceName: service.name,
					providerId: service.providerId,
					providerName: service.providerName,
					businessName: service.businessName,
					clientId: client.id,
					clientName: client.name,
					clientEmail: client.email,
					price: service.price,
					duration: service.duration,
					date: bookingDate,
					status,
					createdAt: serverTimestamp(),
					notes: status === "cancelled" ? "Client requested cancellation" : "",
				});

				console.log(
					`Added ${status} booking for service: ${service.name} by ${client.name}`
				);
			}
		}

		console.log("Bookings seeding completed successfully!");
	} catch (error) {
		console.error("Error seeding bookings:", error);
	}
}

// Run the seed function
seedBookings();
