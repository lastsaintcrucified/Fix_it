/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	addDoc,
	updateDoc,
	deleteDoc,
	serverTimestamp,
	type Timestamp,
	writeBatch,
} from "firebase/firestore";

// Types
export interface Booking {
	id: string;
	serviceId: string;
	serviceName: string;
	providerId: string;
	providerName: string;
	businessName?: string;
	clientId: string;
	clientName: string;
	clientEmail: string;
	price: number;
	duration: number;
	date: Timestamp | Date;
	status: "pending" | "confirmed" | "completed" | "cancelled";
	address?: string;
	notes?: string;
	createdAt: Timestamp | Date;
	updatedAt?: Timestamp | Date;
	reason?: string;
}

export interface Service {
	id: string;
	name: string;
	description: string;
	price: number;
	duration: number;
	category: string;
	providerId: string;
	providerName: string;
	businessName?: string;
	status: string;
	rating?: number;
	createdAt: Timestamp | Date;
	updatedAt?: Timestamp | Date;
}

export interface Review {
	id: string;
	serviceId: string;
	serviceName: string;
	providerId: string;
	providerName: string;
	clientId: string;
	clientName: string;
	rating: number;
	comment: string;
	createdAt: Timestamp | Date;
}

export interface Payment {
	id: string;
	bookingId: string;
	serviceId: string;
	serviceName: string;
	providerId: string;
	providerName: string;
	clientId: string;
	amount: number;
	status: "pending" | "paid" | "refunded" | "failed";
	method?: string;
	date: Timestamp | Date;
	createdAt: Timestamp | Date;
}

export interface Favorite {
	id: string;
	userId: string;
	type: "service" | "provider";
	itemId: string;
	itemName: string;
	createdAt: Timestamp | Date;
}

export interface Message {
	id: string;
	conversationId: string;
	senderId: string;
	senderName: string;
	senderType: "client" | "provider";
	text: string;
	createdAt: Timestamp | Date;
	read: boolean;
}

export interface Conversation {
	id: string;
	clientId: string;
	clientName: string;
	providerId: string;
	providerName: string;
	lastMessage?: string;
	lastMessageDate?: Timestamp | Date;
	unreadCount: number;
	createdAt: Timestamp | Date;
	updatedAt: Timestamp | Date;
}

// Client Dashboard Functions

// Profile functions
export async function getClientProfile(userId: string) {
	try {
		const userRef = doc(db, "users", userId);
		const userSnap = await getDoc(userRef);

		if (userSnap.exists()) {
			return { id: userSnap.id, ...userSnap.data() };
		}

		return null;
	} catch (error) {
		console.error("Error getting client profile:", error);
		throw error;
	}
}

export async function updateClientProfile(userId: string, profileData: any) {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			...profileData,
			updatedAt: serverTimestamp(),
		});
		return true;
	} catch (error) {
		console.error("Error updating client profile:", error);
		throw error;
	}
}

// Booking functions
export async function getClientBookings(clientId: string) {
	try {
		const bookingsRef = collection(db, "bookings");
		const q = query(
			bookingsRef,
			where("clientId", "==", clientId),
			orderBy("date", "desc")
		);

		const querySnapshot = await getDocs(q);
		const bookings: Booking[] = [];

		querySnapshot.forEach((doc) => {
			bookings.push({
				id: doc.id,
				...(doc.data() as Record<string, any>),
			} as Booking);
		});

		return bookings;
	} catch (error) {
		console.error("Error getting client bookings:", error);
		throw error;
	}
}

export async function getUpcomingBookings(clientId: string, maxLimit = 5) {
	try {
		const now = new Date();
		const bookingsRef = collection(db, "bookings");
		const statusConstraints = ["pending", "confirmed"].map((status) =>
			query(
				bookingsRef,
				where("clientId", "==", clientId),
				where("date", ">=", now),
				where("status", "==", status),
				orderBy("date", "asc"),
				limit(maxLimit)
			)
		);

		const querySnapshots = await Promise.all(
			statusConstraints.map((q) => getDocs(q))
		);

		const bookings: Booking[] = [];
		querySnapshots.forEach((snapshot) => {
			snapshot.forEach((doc) => {
				bookings.push({
					id: doc.id,
					...(doc.data() as Record<string, any>),
				} as Booking);
			});
		});

		return bookings;
	} catch (error) {
		console.error("Error getting upcoming bookings:", error);
		throw error;
	}
}

export async function getPastBookings(clientId: string, maxLimit = 10) {
	try {
		const now = new Date();
		const bookingsRef = collection(db, "bookings");
		const q = query(
			bookingsRef,
			where("clientId", "==", clientId),
			where("date", "<", now),
			orderBy("date", "desc"),
			limit(maxLimit)
		);

		const querySnapshot = await getDocs(q);
		const bookings: Booking[] = [];

		querySnapshot.forEach((doc) => {
			bookings.push({
				id: doc.id,
				...(doc.data() as Record<string, any>),
			} as Booking);
		});

		return bookings;
	} catch (error) {
		console.error("Error getting past bookings:", error);
		throw error;
	}
}

export async function getCancelledBookings(clientId: string) {
	try {
		const bookingsRef = collection(db, "bookings");
		const q = query(
			bookingsRef,
			where("clientId", "==", clientId),
			where("status", "==", "cancelled"),
			orderBy("date", "desc")
		);

		const querySnapshot = await getDocs(q);
		const bookings: Booking[] = [];

		querySnapshot.forEach((doc) => {
			bookings.push({ id: doc.id, ...doc.data() } as Booking);
		});

		return bookings;
	} catch (error) {
		console.error("Error getting cancelled bookings:", error);
		throw error;
	}
}

export async function updateBooking(bookingId: string, data: Partial<Booking>) {
	try {
		const bookingRef = doc(db, "bookings", bookingId);
		await updateDoc(bookingRef, {
			...data,
			updatedAt: serverTimestamp(),
		});
		return true;
	} catch (error) {
		console.error("Error updating booking:", error);
		throw error;
	}
}

export async function cancelBooking(bookingId: string, reason: string) {
	try {
		const bookingRef = doc(db, "bookings", bookingId);
		await updateDoc(bookingRef, {
			status: "cancelled",
			reason,
			updatedAt: serverTimestamp(),
		});
		return true;
	} catch (error) {
		console.error("Error cancelling booking:", error);
		throw error;
	}
}

// Favorites functions
export async function getClientFavorites(userId: string) {
	try {
		const favoritesRef = collection(db, "favorites");
		const q = query(
			favoritesRef,
			where("userId", "==", userId),
			orderBy("createdAt", "desc")
		);

		const querySnapshot = await getDocs(q);
		const favorites: Favorite[] = [];

		querySnapshot.forEach((doc) => {
			favorites.push({ id: doc.id, ...doc.data() } as Favorite);
		});

		return favorites;
	} catch (error) {
		console.error("Error getting client favorites:", error);
		throw error;
	}
}

export async function getFavoriteServices(userId: string) {
	try {
		const favoritesRef = collection(db, "favorites");
		const q = query(
			favoritesRef,
			where("userId", "==", userId),
			where("type", "==", "service"),
			orderBy("createdAt", "desc")
		);

		const querySnapshot = await getDocs(q);
		const favorites: Favorite[] = [];
		const services: Service[] = [];

		for (const doc of querySnapshot.docs) {
			const favorite = { id: doc.id, ...doc.data() } as Favorite;
			favorites.push(favorite);

			// Get the service details
			const serviceDoc = await getDoc(
				await document(db, "services", favorite.itemId)
			);
			if (serviceDoc.exists()) {
				services.push({ id: serviceDoc.id, ...serviceDoc.data() } as Service);
			}
		}

		return services;
	} catch (error) {
		console.error("Error getting favorite services:", error);
		throw error;
	}
}

export async function getFavoriteProviders(userId: string) {
	try {
		const favoritesRef = collection(db, "favorites");
		const q = query(
			favoritesRef,
			where("userId", "==", userId),
			where("type", "==", "provider"),
			orderBy("createdAt", "desc")
		);

		const querySnapshot = await getDocs(q);
		const favorites: Favorite[] = [];
		const providers: any[] = [];

		for (const doc of querySnapshot.docs) {
			const favorite = { id: doc.id, ...doc.data() } as Favorite;
			favorites.push(favorite);

			// Get the provider details
			const providerDoc = await getDoc(
				await document(db, "users", favorite.itemId)
			);
			if (providerDoc.exists()) {
				providers.push({ id: providerDoc.id, ...providerDoc.data() });
			}
		}

		return providers;
	} catch (error) {
		console.error("Error getting favorite providers:", error);
		throw error;
	}
}

export async function addToFavorites(
	userId: string,
	type: "service" | "provider",
	itemId: string,
	itemName: string
) {
	try {
		// Check if already in favorites
		const favoritesRef = collection(db, "favorites");
		const q = query(
			favoritesRef,
			where("userId", "==", userId),
			where("type", "==", type),
			where("itemId", "==", itemId)
		);

		const querySnapshot = await getDocs(q);
		if (!querySnapshot.empty) {
			// Already in favorites
			return { id: querySnapshot.docs[0].id, exists: true };
		}

		// Add to favorites
		const docRef = await addDoc(collection(db, "favorites"), {
			userId,
			type,
			itemId,
			itemName,
			createdAt: serverTimestamp(),
		});

		return { id: docRef.id, exists: false };
	} catch (error) {
		console.error("Error adding to favorites:", error);
		throw error;
	}
}

export async function removeFromFavorites(favoriteId: string) {
	try {
		await deleteDoc(doc(db, "favorites", favoriteId));
		return true;
	} catch (error) {
		console.error("Error removing from favorites:", error);
		throw error;
	}
}

// Reviews functions
export async function getClientReviews(clientId: string) {
	try {
		const reviewsRef = collection(db, "reviews");
		const q = query(
			reviewsRef,
			where("clientId", "==", clientId),
			orderBy("createdAt", "desc")
		);

		const querySnapshot = await getDocs(q);
		const reviews: Review[] = [];

		querySnapshot.forEach((doc) => {
			reviews.push({ id: doc.id, ...doc.data() } as Review);
		});

		return reviews;
	} catch (error) {
		console.error("Error getting client reviews:", error);
		throw error;
	}
}

export async function getPendingReviews(clientId: string) {
	try {
		// Get completed bookings that don't have reviews
		const bookingsRef = collection(db, "bookings");
		const q = query(
			bookingsRef,
			where("clientId", "==", clientId),
			where("status", "==", "completed"),
			orderBy("date", "desc")
		);

		const bookingsSnapshot = await getDocs(q);
		const completedBookings: Booking[] = [];

		bookingsSnapshot.forEach((doc) => {
			completedBookings.push({ id: doc.id, ...doc.data() } as Booking);
		});

		// Get existing reviews
		const reviewsRef = collection(db, "reviews");
		const reviewsQuery = query(reviewsRef, where("clientId", "==", clientId));

		const reviewsSnapshot = await getDocs(reviewsQuery);
		const reviewedServiceIds = new Set<string>();

		reviewsSnapshot.forEach((doc) => {
			const review = doc.data();
			reviewedServiceIds.add(review.serviceId);
		});

		// Filter out bookings that already have reviews
		const pendingReviews = completedBookings.filter(
			(booking) => !reviewedServiceIds.has(booking.serviceId)
		);

		return pendingReviews;
	} catch (error) {
		console.error("Error getting pending reviews:", error);
		throw error;
	}
}

export async function createReview(
	reviewData: Omit<Review, "id" | "createdAt">
) {
	try {
		const docRef = await addDoc(collection(db, "reviews"), {
			...reviewData,
			createdAt: serverTimestamp(),
		});
		return docRef.id;
	} catch (error) {
		console.error("Error creating review:", error);
		throw error;
	}
}

export async function updateReview(reviewId: string, data: Partial<Review>) {
	try {
		const reviewRef = doc(db, "reviews", reviewId);
		await updateDoc(reviewRef, {
			...data,
			updatedAt: serverTimestamp(),
		});
		return true;
	} catch (error) {
		console.error("Error updating review:", error);
		throw error;
	}
}

export async function deleteReview(reviewId: string) {
	try {
		await deleteDoc(doc(db, "reviews", reviewId));
		return true;
	} catch (error) {
		console.error("Error deleting review:", error);
		throw error;
	}
}

// Payments functions
export async function getClientPayments(clientId: string) {
	try {
		const paymentsRef = collection(db, "payments");
		const q = query(
			paymentsRef,
			where("clientId", "==", clientId),
			orderBy("date", "desc")
		);

		const querySnapshot = await getDocs(q);
		const payments: Payment[] = [];

		querySnapshot.forEach((doc) => {
			payments.push({ id: doc.id, ...doc.data() } as Payment);
		});

		return payments;
	} catch (error) {
		console.error("Error getting client payments:", error);
		throw error;
	}
}

// Messages functions
export async function getClientConversations(clientId: string) {
	try {
		const conversationsRef = collection(db, "conversations");
		const q = query(
			conversationsRef,
			where("clientId", "==", clientId),
			orderBy("updatedAt", "desc")
		);

		const querySnapshot = await getDocs(q);
		const conversations: Conversation[] = [];

		querySnapshot.forEach((doc) => {
			conversations.push({ id: doc.id, ...doc.data() } as Conversation);
		});

		return conversations;
	} catch (error) {
		console.error("Error getting client conversations:", error);
		throw error;
	}
}

export async function getConversationMessages(conversationId: string) {
	try {
		const messagesRef = collection(db, "messages");
		const q = query(
			messagesRef,
			where("conversationId", "==", conversationId),
			orderBy("createdAt", "asc")
		);

		const querySnapshot = await getDocs(q);
		const messages: Message[] = [];

		querySnapshot.forEach((doc) => {
			messages.push({ id: doc.id, ...doc.data() } as Message);
		});

		return messages;
	} catch (error) {
		console.error("Error getting conversation messages:", error);
		throw error;
	}
}

export async function sendMessage(
	conversationId: string,
	senderId: string,
	senderName: string,
	senderType: "client" | "provider",
	text: string
) {
	try {
		// Add message
		const messageRef = await addDoc(collection(db, "messages"), {
			conversationId,
			senderId,
			senderName,
			senderType,
			text,
			createdAt: serverTimestamp(),
			read: false,
		});

		// Update conversation
		const conversationRef = doc(db, "conversations", conversationId);
		await updateDoc(conversationRef, {
			lastMessage: text,
			lastMessageDate: serverTimestamp(),
			updatedAt: serverTimestamp(),
			// Increment unread count for the recipient
			unreadCount: senderType === "client" ? 0 : 1, // If client is sending, provider has 1 unread
		});

		return messageRef.id;
	} catch (error) {
		console.error("Error sending message:", error);
		throw error;
	}
}

export async function markConversationAsRead(
	conversationId: string,
	userId: string
) {
	try {
		// Get conversation to check if user is client or provider
		const conversationRef = doc(db, "conversations", conversationId);
		const conversationSnap = await getDoc(conversationRef);

		if (!conversationSnap.exists()) {
			throw new Error("Conversation not found");
		}

		const conversation = conversationSnap.data() as Conversation;
		const isClient = conversation.clientId === userId;

		// Update messages
		const messagesRef = collection(db, "messages");
		const q = query(
			messagesRef,
			where("conversationId", "==", conversationId),
			where("senderType", "==", isClient ? "provider" : "client"), // Only mark other party's messages as read
			where("read", "==", false)
		);

		const querySnapshot = await getDocs(q);
		const batch = writeBatch(db);

		querySnapshot.forEach((doc) => {
			batch.update(doc.ref, { read: true });
		});

		// Update conversation
		batch.update(conversationRef, { unreadCount: 0 });

		await batch.commit();
		return true;
	} catch (error) {
		console.error("Error marking conversation as read:", error);
		throw error;
	}
}

// Dashboard stats
export async function getClientDashboardStats(clientId: string) {
	try {
		// Get counts and stats
		const [bookings, favorites, reviews, payments] = await Promise.all([
			getClientBookings(clientId),
			getClientFavorites(clientId),
			getClientReviews(clientId),
			getClientPayments(clientId),
		]);

		// Calculate stats
		const activeBookings = bookings.filter(
			(b) => b.status === "pending" || b.status === "confirmed"
		).length;

		const upcomingBookings = bookings.filter((b) => {
			const bookingDate = b.date instanceof Date ? b.date : b.date.toDate();
			const now = new Date();
			return (
				bookingDate > now &&
				(b.status === "pending" || b.status === "confirmed")
			);
		}).length;

		const favoriteServices = favorites.filter(
			(f) => f.type === "service"
		).length;
		const favoriteProviders = favorites.filter(
			(f) => f.type === "provider"
		).length;

		const totalSpent = payments
			.filter((p) => p.status === "paid")
			.reduce((sum, payment) => sum + payment.amount, 0);

		const reviewsGiven = reviews.length;

		// Calculate average rating given
		const avgRating =
			reviews.length > 0
				? reviews.reduce((sum, review) => sum + review.rating, 0) /
				  reviews.length
				: 0;

		return {
			activeBookings,
			upcomingBookings,
			favoriteServices,
			favoriteProviders,
			totalFavorites: favorites.length,
			totalSpent,
			reviewsGiven,
			averageRating: avgRating,
			recentBookings: bookings.slice(0, 5),
			recentReviews: reviews.slice(0, 3),
		};
	} catch (error) {
		console.error("Error getting client dashboard stats:", error);
		throw error;
	}
}

// Helper function to get document by reference
async function document(db: any, collection: string, id: string) {
	return doc(db, collection, id);
}
