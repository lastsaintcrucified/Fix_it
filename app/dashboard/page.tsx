/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CalendarClock,
	CreditCard,
	DollarSign,
	Star,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
	collection,
	query,
	where,
	orderBy,
	getDocs,
	limit,
	Timestamp,
} from "firebase/firestore";
import Link from "next/link";

export default function DashboardPage() {
	const { user, userData } = useAuth();
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalRevenue: 0,
		bookingsCount: 0,
		activeClients: 0,
		averageRating: 0,
	});
	const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
	const [recentPayments, setRecentPayments] = useState<any[]>([]);

	useEffect(() => {
		if (user) {
			fetchDashboardData();
		}
	}, [user]);

	const fetchDashboardData = async () => {
		if (!user) return;

		setLoading(true);
		try {
			// Fetch stats
			const [totalRevenue, bookingsCount, activeClients, averageRating] =
				await Promise.all([
					fetchTotalRevenue(),
					fetchBookingsCount(),
					fetchActiveClients(),
					fetchAverageRating(),
				]);

			setStats({
				totalRevenue,
				bookingsCount,
				activeClients,
				averageRating,
			});

			// Fetch upcoming bookings
			const bookings = await fetchUpcomingBookings();
			setUpcomingBookings(bookings);

			// Fetch recent payments
			const payments = await fetchRecentPayments();
			setRecentPayments(payments);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchTotalRevenue = async () => {
		try {
			const paymentsRef = collection(db, "payments");
			const q = query(
				paymentsRef,
				where("providerId", "==", user?.uid),
				where("status", "==", "paid")
			);

			const querySnapshot = await getDocs(q);
			let total = 0;

			querySnapshot.forEach((doc) => {
				const payment = doc.data();
				total += payment.amount || 0;
			});

			return total;
		} catch (error) {
			console.error("Error fetching total revenue:", error);
			return 0;
		}
	};

	const fetchBookingsCount = async () => {
		try {
			const bookingsRef = collection(db, "bookings");
			const q = query(bookingsRef, where("providerId", "==", user?.uid));

			const querySnapshot = await getDocs(q);
			return querySnapshot.size;
		} catch (error) {
			console.error("Error fetching bookings count:", error);
			return 0;
		}
	};

	const fetchActiveClients = async () => {
		try {
			const bookingsRef = collection(db, "bookings");
			const q = query(
				bookingsRef,
				where("providerId", "==", user?.uid),
				where("status", "in", ["pending", "confirmed", "in_progress"])
			);

			const querySnapshot = await getDocs(q);

			// Count unique clients
			const uniqueClients = new Set();
			querySnapshot.forEach((doc) => {
				const booking = doc.data();
				uniqueClients.add(booking.clientId);
			});

			return uniqueClients.size;
		} catch (error) {
			console.error("Error fetching active clients:", error);
			return 0;
		}
	};

	const fetchAverageRating = async () => {
		try {
			const reviewsRef = collection(db, "reviews");
			const q = query(reviewsRef, where("providerId", "==", user?.uid));

			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) return 0;

			let totalRating = 0;
			querySnapshot.forEach((doc) => {
				const review = doc.data();
				totalRating += review.rating || 0;
			});

			return Number.parseFloat((totalRating / querySnapshot.size).toFixed(1));
		} catch (error) {
			console.error("Error fetching average rating:", error);
			return 0;
		}
	};

	const fetchUpcomingBookings = async () => {
		try {
			const now = new Date();
			const bookingsRef = collection(db, "bookings");
			const q = query(
				bookingsRef,
				where("providerId", "==", user?.uid),
				where("status", "in", ["pending", "confirmed", "in_progress"]),
				where("date", ">=", now),
				orderBy("date", "asc"),
				limit(4)
			);

			const querySnapshot = await getDocs(q);
			const bookings: any[] = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				bookings.push({
					id: doc.id,
					...data,
					date:
						data.date instanceof Timestamp
							? data.date.toDate()
							: new Date(data.date),
				});
			});

			return bookings;
		} catch (error) {
			console.error("Error fetching upcoming bookings:", error);
			return [];
		}
	};

	const fetchRecentPayments = async () => {
		try {
			const paymentsRef = collection(db, "payments");
			const q = query(
				paymentsRef,
				where("providerId", "==", user?.uid),
				where("status", "==", "paid"),
				orderBy("date", "desc"),
				limit(4)
			);

			const querySnapshot = await getDocs(q);
			const payments: any[] = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				payments.push({
					id: doc.id,
					...data,
					date:
						data.date instanceof Timestamp
							? data.date.toDate()
							: new Date(data.date),
				});
			});

			return payments;
		} catch (error) {
			console.error("Error fetching recent payments:", error);
			return [];
		}
	};

	const formatDate = (date: Date) => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return `Today, ${date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}`;
		} else if (date.toDateString() === yesterday.toDateString()) {
			return `Yesterday, ${date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}`;
		} else {
			return date.toLocaleDateString([], {
				weekday: "short",
				month: "short",
				day: "numeric",
			});
		}
	};

	const getRelativeTimeString = (date: Date) => {
		const now = new Date();
		const diffInDays = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
		);

		if (diffInDays === 0) return "Today";
		if (diffInDays === 1) return "Yesterday";
		if (diffInDays < 7) return `${diffInDays} days ago`;
		if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
		return `${Math.floor(diffInDays / 30)} months ago`;
	};

	if (loading) {
		return (
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
					<p className='text-muted-foreground'>Loading dashboard data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
				<p className='text-muted-foreground'>
					Welcome back,{" "}
					{userData?.displayName || user?.displayName || "Provider"}! Here is an
					overview of your business.
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
						<DollarSign className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							${stats.totalRevenue.toFixed(2)}
						</div>
						<p className='text-xs text-muted-foreground'>
							From all completed services
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Bookings</CardTitle>
						<CalendarClock className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.bookingsCount}</div>
						<p className='text-xs text-muted-foreground'>
							Total bookings received
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Active Clients
						</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.activeClients}</div>
						<p className='text-xs text-muted-foreground'>
							Clients with active bookings
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Average Rating
						</CardTitle>
						<Star className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{stats.averageRating || "N/A"}
						</div>
						<p className='text-xs text-muted-foreground'>
							Based on client reviews
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs
				defaultValue='upcoming'
				className='w-full'
			>
				<TabsList>
					<TabsTrigger value='upcoming'>Upcoming Bookings</TabsTrigger>
					<TabsTrigger value='recent'>Recent Payments</TabsTrigger>
				</TabsList>
				<TabsContent
					value='upcoming'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Upcoming Bookings</CardTitle>
							<CardDescription>
								You have {upcomingBookings.length} upcoming bookings
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{upcomingBookings.length === 0 ? (
								<div className='text-center py-6'>
									<p className='text-muted-foreground'>No upcoming bookings</p>
								</div>
							) : (
								upcomingBookings.map((booking) => (
									<div
										key={booking.id}
										className='flex items-center justify-between rounded-lg border p-4'
									>
										<div className='flex items-center gap-4'>
											<Avatar>
												<AvatarFallback>
													{booking.clientName
														.split(" ")
														.map((n: string) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className='font-medium'>{booking.clientName}</p>
												<p className='text-sm text-muted-foreground'>
													{booking.serviceName}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-4'>
											<div className='text-right'>
												<p className='text-sm font-medium'>
													{formatDate(booking.date)}
												</p>
												<Badge
													variant={
														booking.status === "confirmed"
															? "default"
															: "outline"
													}
												>
													{booking.status}
												</Badge>
											</div>
											<Link href='/dashboard/bookings'>
												<Button
													variant='ghost'
													size='icon'
												>
													<CalendarClock className='h-4 w-4' />
													<span className='sr-only'>View booking</span>
												</Button>
											</Link>
										</div>
									</div>
								))
							)}
							<Link href='/dashboard/bookings'>
								<Button
									variant='outline'
									className='w-full'
								>
									View all bookings
								</Button>
							</Link>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent
					value='recent'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Recent Payments</CardTitle>
							<CardDescription>
								{recentPayments.length > 0
									? `You received ${recentPayments.length} payments recently`
									: "No recent payments"}
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{recentPayments.length === 0 ? (
								<div className='text-center py-6'>
									<p className='text-muted-foreground'>No recent payments</p>
								</div>
							) : (
								recentPayments.map((payment) => (
									<div
										key={payment.id}
										className='flex items-center justify-between rounded-lg border p-4'
									>
										<div className='flex items-center gap-4'>
											<Avatar>
												<AvatarFallback>
													{payment.clientName
														.split(" ")
														.map((n: string) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className='font-medium'>{payment.clientName}</p>
												<p className='text-sm text-muted-foreground'>
													{payment.serviceName}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-4'>
											<div className='text-right'>
												<p className='text-sm font-medium'>
													${payment.amount.toFixed(2)}
												</p>
												<p className='text-xs text-muted-foreground'>
													{getRelativeTimeString(payment.date)}
												</p>
											</div>
											<Button
												variant='ghost'
												size='icon'
											>
												<CreditCard className='h-4 w-4' />
												<span className='sr-only'>View payment</span>
											</Button>
										</div>
									</div>
								))
							)}
							<Button
								variant='outline'
								className='w-full'
							>
								View all payments
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
