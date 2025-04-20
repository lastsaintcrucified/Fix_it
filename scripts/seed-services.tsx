/**
 * This script seeds the Firebase database with sample services
 * Run with: npx tsx scripts/seed-services.tsx
 */

import { initializeApp } from "firebase/app";
import {
	getFirestore,
	collection,
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

// Sample providers (in a real app, these would be actual user IDs)
const providers = [
	{
		id: "provider1",
		name: "John Smith",
		businessName: "Smith's Professional Services",
	},
	{
		id: "provider2",
		name: "Maria Garcia",
		businessName: "Garcia Home Services",
	},
	{
		id: "provider3",
		name: "David Johnson",
		businessName: "Johnson's Electrical Solutions",
	},
	{
		id: "provider4",
		name: "Sarah Williams",
		businessName: "Green Thumb Gardening",
	},
	{
		id: "provider5",
		name: "Michael Brown",
		businessName: "FitLife Personal Training",
	},
	{
		id: "provider6",
		name: "Jennifer Lee",
		businessName: "Serenity Spa & Beauty",
	},
];

// Sample services
const services = [
	// Cleaning Services
	{
		name: "Basic Home Cleaning",
		description:
			"Standard cleaning service for homes up to 1,500 sq ft. Includes dusting, vacuuming, mopping, and bathroom cleaning.",
		price: 120,
		duration: 120, // in minutes
		category: "cleaning",
		providerId: "provider1",
		providerName: "John Smith",
		businessName: "Smith's Professional Services",
		status: "active",
		rating: 4.8,
	},
	{
		name: "Deep Home Cleaning",
		description:
			"Thorough cleaning including hard-to-reach areas, inside appliances, and detailed bathroom and kitchen cleaning.",
		price: 200,
		duration: 240, // in minutes
		category: "cleaning",
		providerId: "provider1",
		providerName: "John Smith",
		businessName: "Smith's Professional Services",
		status: "active",
		rating: 4.9,
	},
	{
		name: "Office Cleaning",
		description:
			"Professional cleaning for office spaces up to 2,000 sq ft. Perfect for small businesses.",
		price: 180,
		duration: 180, // in minutes
		category: "cleaning",
		providerId: "provider2",
		providerName: "Maria Garcia",
		businessName: "Garcia Home Services",
		status: "active",
		rating: 4.7,
	},
	{
		name: "Move-in/Move-out Cleaning",
		description:
			"Complete cleaning for moving in or out of a property. Ensures the space is spotless.",
		price: 250,
		duration: 300, // in minutes
		category: "cleaning",
		providerId: "provider2",
		providerName: "Maria Garcia",
		businessName: "Garcia Home Services",
		status: "active",
		rating: 4.6,
	},

	// Plumbing Services
	{
		name: "Drain Cleaning",
		description:
			"Professional drain cleaning service to remove clogs and ensure proper water flow.",
		price: 120,
		duration: 60, // in minutes
		category: "plumbing",
		providerId: "provider2",
		providerName: "Maria Garcia",
		businessName: "Garcia Home Services",
		status: "active",
		rating: 4.8,
	},
	{
		name: "Faucet Installation",
		description: "Professional installation of kitchen or bathroom faucets.",
		price: 150,
		duration: 90, // in minutes
		category: "plumbing",
		providerId: "provider2",
		providerName: "Maria Garcia",
		businessName: "Garcia Home Services",
		status: "active",
		rating: 4.9,
	},
	{
		name: "Water Heater Repair",
		description:
			"Diagnosis and repair of water heater issues to restore hot water to your home.",
		price: 200,
		duration: 120, // in minutes
		category: "plumbing",
		providerId: "provider1",
		providerName: "John Smith",
		businessName: "Smith's Professional Services",
		status: "active",
		rating: 4.7,
	},
	{
		name: "Pipe Leak Repair",
		description:
			"Quick and effective repair of leaking pipes to prevent water damage.",
		price: 180,
		duration: 90, // in minutes
		category: "plumbing",
		providerId: "provider1",
		providerName: "John Smith",
		businessName: "Smith's Professional Services",
		status: "active",
		rating: 4.8,
	},

	// Electrical Services
	{
		name: "Outlet Installation",
		description:
			"Professional installation of new electrical outlets in your home or office.",
		price: 120,
		duration: 60, // in minutes
		category: "electrical",
		providerId: "provider3",
		providerName: "David Johnson",
		businessName: "Johnson's Electrical Solutions",
		status: "active",
		rating: 4.9,
	},
	{
		name: "Ceiling Fan Installation",
		description:
			"Expert installation of ceiling fans, including wiring and mounting.",
		price: 150,
		duration: 90, // in minutes
		category: "electrical",
		providerId: "provider3",
		providerName: "David Johnson",
		businessName: "Johnson's Electrical Solutions",
		status: "active",
		rating: 4.8,
	},
	{
		name: "Electrical Panel Upgrade",
		description:
			"Upgrade your electrical panel to handle modern power demands safely.",
		price: 800,
		duration: 300, // in minutes
		category: "electrical",
		providerId: "provider3",
		providerName: "David Johnson",
		businessName: "Johnson's Electrical Solutions",
		status: "active",
		rating: 4.9,
	},
	{
		name: "Lighting Installation",
		description:
			"Professional installation of indoor or outdoor lighting fixtures.",
		price: 140,
		duration: 75, // in minutes
		category: "electrical",
		providerId: "provider3",
		providerName: "David Johnson",
		businessName: "Johnson's Electrical Solutions",
		status: "active",
		rating: 4.7,
	},

	// Gardening Services
	{
		name: "Lawn Mowing",
		description:
			"Regular lawn mowing service to keep your yard looking neat and tidy.",
		price: 50,
		duration: 60, // in minutes
		category: "gardening",
		providerId: "provider4",
		providerName: "Sarah Williams",
		businessName: "Green Thumb Gardening",
		status: "active",
		rating: 4.6,
	},
	{
		name: "Garden Design",
		description:
			"Professional garden design service to transform your outdoor space.",
		price: 300,
		duration: 180, // in minutes
		category: "gardening",
		providerId: "provider4",
		providerName: "Sarah Williams",
		businessName: "Green Thumb Gardening",
		status: "active",
		rating: 4.9,
	},
	{
		name: "Tree Trimming",
		description:
			"Expert tree trimming and pruning to maintain tree health and appearance.",
		price: 200,
		duration: 120, // in minutes
		category: "gardening",
		providerId: "provider4",
		providerName: "Sarah Williams",
		businessName: "Green Thumb Gardening",
		status: "active",
		rating: 4.8,
	},
	{
		name: "Irrigation System Installation",
		description:
			"Professional installation of irrigation systems for efficient watering of your lawn and garden.",
		price: 500,
		duration: 240, // in minutes
		category: "gardening",
		providerId: "provider4",
		providerName: "Sarah Williams",
		businessName: "Green Thumb Gardening",
		status: "active",
		rating: 4.7,
	},

	// Fitness Services
	{
		name: "Personal Training Session",
		description:
			"One-on-one personal training session tailored to your fitness goals.",
		price: 80,
		duration: 60, // in minutes
		category: "fitness",
		providerId: "provider5",
		providerName: "Michael Brown",
		businessName: "FitLife Personal Training",
		status: "active",
		rating: 4.9,
	},
	{
		name: "Yoga Class",
		description:
			"Private yoga class focusing on flexibility, strength, and mindfulness.",
		price: 60,
		duration: 60, // in minutes
		category: "fitness",
		providerId: "provider5",
		providerName: "Michael Brown",
		businessName: "FitLife Personal Training",
		status: "active",
		rating: 4.8,
	},
	{
		name: "Nutrition Consultation",
		description:
			"Professional nutrition consultation to help you achieve your health and fitness goals.",
		price: 100,
		duration: 90, // in minutes
		category: "fitness",
		providerId: "provider5",
		providerName: "Michael Brown",
		businessName: "FitLife Personal Training",
		status: "active",
		rating: 4.7,
	},
	{
		name: "Group Fitness Class",
		description:
			"High-energy group fitness class for up to 5 people. Great for friends or family.",
		price: 120,
		duration: 60, // in minutes
		category: "fitness",
		providerId: "provider5",
		providerName: "Michael Brown",
		businessName: "FitLife Personal Training",
		status: "active",
		rating: 4.8,
	},

	// Beauty & Spa Services
	{
		name: "Haircut and Style",
		description: "Professional haircut and styling service for all hair types.",
		price: 60,
		duration: 60, // in minutes
		category: "beauty",
		providerId: "provider6",
		providerName: "Jennifer Lee",
		businessName: "Serenity Spa & Beauty",
		status: "active",
		rating: 4.8,
	},
	{
		name: "Full Body Massage",
		description: "Relaxing full body massage to relieve stress and tension.",
		price: 90,
		duration: 60, // in minutes
		category: "beauty",
		providerId: "provider6",
		providerName: "Jennifer Lee",
		businessName: "Serenity Spa & Beauty",
		status: "active",
		rating: 4.9,
	},
	{
		name: "Facial Treatment",
		description:
			"Rejuvenating facial treatment to cleanse, exfoliate, and hydrate your skin.",
		price: 80,
		duration: 60, // in minutes
		category: "beauty",
		providerId: "provider6",
		providerName: "Jennifer Lee",
		businessName: "Serenity Spa & Beauty",
		status: "active",
		rating: 4.7,
	},
	{
		name: "Manicure and Pedicure",
		description:
			"Complete manicure and pedicure service for well-groomed hands and feet.",
		price: 70,
		duration: 90, // in minutes
		category: "beauty",
		providerId: "provider6",
		providerName: "Jennifer Lee",
		businessName: "Serenity Spa & Beauty",
		status: "active",
		rating: 4.8,
	},
];

// Function to seed the database
async function seedDatabase() {
	console.log("Starting to seed database...");

	try {
		// Add providers to the database
		for (const provider of providers) {
			await addDoc(collection(db, "users"), {
				uid: provider.id,
				displayName: provider.name,
				businessName: provider.businessName,
				role: "provider",
				email: `${provider.name.toLowerCase().replace(" ", ".")}@example.com`,
				createdAt: serverTimestamp(),
				bio: `Professional service provider with years of experience in the industry.`,
			});
			console.log(`Added provider: ${provider.name}`);
		}

		// Add services to the database
		for (const service of services) {
			await addDoc(collection(db, "services"), {
				...service,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
			console.log(`Added service: ${service.name}`);
		}

		console.log("Database seeding completed successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	}
}

// Run the seed function
seedDatabase();
