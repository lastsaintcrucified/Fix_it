import { db } from "./firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	serverTimestamp,
	type DocumentData,
} from "firebase/firestore";

// User related functions
export async function getUserProfile(userId: string) {
	const userRef = doc(db, "users", userId);
	const userSnap = await getDoc(userRef);

	if (userSnap.exists()) {
		return { id: userSnap.id, ...userSnap.data() };
	}

	return null;
}

// Service related functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createService(serviceData: any) {
	const serviceRef = doc(collection(db, "services"));
	await setDoc(serviceRef, {
		...serviceData,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});

	return serviceRef.id;
}

export async function getServicesByProvider(providerId: string) {
	const servicesRef = collection(db, "services");
	const q = query(
		servicesRef,
		where("providerId", "==", providerId),
		orderBy("createdAt", "desc")
	);

	const querySnapshot = await getDocs(q);
	const services: DocumentData[] = [];

	querySnapshot.forEach((doc) => {
		services.push({ id: doc.id, ...doc.data() });
	});

	return services;
}

export async function getServiceById(serviceId: string) {
	const serviceRef = doc(db, "services", serviceId);
	const serviceSnap = await getDoc(serviceRef);

	if (serviceSnap.exists()) {
		return { id: serviceSnap.id, ...serviceSnap.data() };
	}

	return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateService(serviceId: string, serviceData: any) {
	const serviceRef = doc(db, "services", serviceId);
	await updateDoc(serviceRef, {
		...serviceData,
		updatedAt: serverTimestamp(),
	});
}

export async function deleteService(serviceId: string) {
	const serviceRef = doc(db, "services", serviceId);
	await deleteDoc(serviceRef);
}

// Booking related functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createBooking(bookingData: any) {
	const bookingRef = doc(collection(db, "bookings"));
	await setDoc(bookingRef, {
		...bookingData,
		status: "pending",
		createdAt: serverTimestamp(),
	});

	return bookingRef.id;
}

export async function getBookingsByClient(clientId: string) {
	const bookingsRef = collection(db, "bookings");
	const q = query(
		bookingsRef,
		where("clientId", "==", clientId),
		orderBy("createdAt", "desc")
	);

	const querySnapshot = await getDocs(q);
	const bookings: DocumentData[] = [];

	querySnapshot.forEach((doc) => {
		bookings.push({ id: doc.id, ...doc.data() });
	});

	return bookings;
}

export async function getBookingsByProvider(providerId: string) {
	const bookingsRef = collection(db, "bookings");
	const q = query(
		bookingsRef,
		where("providerId", "==", providerId),
		orderBy("createdAt", "desc")
	);

	const querySnapshot = await getDocs(q);
	const bookings: DocumentData[] = [];

	querySnapshot.forEach((doc) => {
		bookings.push({ id: doc.id, ...doc.data() });
	});

	return bookings;
}

export async function updateBookingStatus(bookingId: string, status: string) {
	const bookingRef = doc(db, "bookings", bookingId);
	await updateDoc(bookingRef, {
		status,
		updatedAt: serverTimestamp(),
	});
}

// Review related functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createReview(reviewData: any) {
	const reviewRef = doc(collection(db, "reviews"));
	await setDoc(reviewRef, {
		...reviewData,
		createdAt: serverTimestamp(),
	});

	return reviewRef.id;
}

export async function getReviewsByProvider(providerId: string) {
	const reviewsRef = collection(db, "reviews");
	const q = query(
		reviewsRef,
		where("providerId", "==", providerId),
		orderBy("createdAt", "desc")
	);

	const querySnapshot = await getDocs(q);
	const reviews: DocumentData[] = [];

	querySnapshot.forEach((doc) => {
		reviews.push({ id: doc.id, ...doc.data() });
	});

	return reviews;
}

export async function getReviewsByClient(clientId: string) {
	const reviewsRef = collection(db, "reviews");
	const q = query(
		reviewsRef,
		where("clientId", "==", clientId),
		orderBy("createdAt", "desc")
	);

	const querySnapshot = await getDocs(q);
	const reviews: DocumentData[] = [];

	querySnapshot.forEach((doc) => {
		reviews.push({ id: doc.id, ...doc.data() });
	});

	return reviews;
}
