/**
 * This script seeds the Firebase database with sample reviews
 * Run with: npx tsx scripts/seed-reviews.tsx
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
	{ id: "client1", name: "Emma Thompson" },
	{ id: "client2", name: "Robert Chen" },
	{ id: "client3", name: "Olivia Martinez" },
	{ id: "client4", name: "James Wilson" },
	{ id: "client5", name: "Sophia Davis" },
];

// Sample review comments
const reviewComments = [
	"Excellent service! Very professional and thorough.",
	"Great job! I'm very satisfied with the quality of work.",
	"Prompt, professional, and reasonably priced. Would hire again.",
	"The service provider was friendly and did an amazing job.",
	"Very knowledgeable and efficient. Highly recommend!",
	"Exceeded my expectations. Will definitely use again.",
	"On time, courteous, and did excellent work.",
	"Very pleased with the service. Worth every penny.",
	"Professional, thorough, and attentive to detail.",
	"Great communication and excellent service quality.",
];

// Function to generate a random rating between 4 and 5
function getRandomRating() {
	return Math.floor(Math.random() * 2) + 4; // 4 or 5
}

// Function to get a random item from an array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRandomItem(array: any[]) {
	return array[Math.floor(Math.random() * array.length)];
}

// Function to seed the database with reviews
async function seedReviews() {
	console.log("Starting to seed reviews...");

	try {
		// Get all services from the database
		const servicesSnapshot = await getDocs(collection(db, "services"));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const services: any[] = [];
		servicesSnapshot.forEach((doc) => {
			services.push({ id: doc.id, ...doc.data() });
		});

		// Create 2-4 reviews for each service
		for (const service of services) {
			const numReviews = Math.floor(Math.random() * 3) + 2; // 2 to 4 reviews per service

			for (let i = 0; i < numReviews; i++) {
				const client = getRandomItem(clients);
				const rating = getRandomRating();
				const comment = getRandomItem(reviewComments);

				// Add review to the database
				await addDoc(collection(db, "reviews"), {
					serviceId: service.id,
					serviceName: service.name,
					providerId: service.providerId,
					providerName: service.providerName,
					clientId: client.id,
					clientName: client.name,
					rating,
					comment,
					createdAt: serverTimestamp(),
				});

				console.log(
					`Added review for service: ${service.name} by ${client.name}`
				);
			}
		}

		console.log("Reviews seeding completed successfully!");
	} catch (error) {
		console.error("Error seeding reviews:", error);
	}
}

// Run the seed function
seedReviews();
