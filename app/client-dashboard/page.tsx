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
	Calendar,
	CreditCard,
	Heart,
	Shield,
	Star,
	MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
	getClientDashboardStats,
	getUpcomingBookings,
	getPastBookings,
} from "@/lib/client-db";
import { formatDistanceToNow, format, isAfter } from "date-fns";

export default function ClientDashboardPage() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<any>(null);
	const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
	const [recentServices, setRecentServices] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			if (!user) return;

			try {
				setLoading(true);

				// Fetch dashboard stats
				const dashboardStats = await getClientDashboardStats(user.uid);
				setStats(dashboardStats);

				// Fetch upcoming bookings
				const upcoming = await getUpcomingBookings(user.uid, 3);
				setUpcomingBookings(upcoming);

				// Fetch recent services (completed bookings)
				const pastBookings = await getPastBookings(user.uid, 3);
				setRecentServices(
					pastBookings.filter((booking) => booking.status === "completed")
				);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				setError("Failed to load dashboard data. Please try again.");
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [user]);

	// Format date for display
	const formatDate = (date: Date | any) => {
		if (!date) return "";
		const dateObj = date instanceof Date ? date : date.toDate();

		if (isAfter(dateObj, new Date())) {
			return formatDistanceToNow(dateObj, { addSuffix: true });
		}

		return format(dateObj, "MMM d, h:mm a");
	};

	if (loading) {
		return (
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-3xl font-bold tracking-tight'>
						Client Dashboard
					</h1>
					<p className='text-muted-foreground'>Loading your dashboard...</p>
				</div>
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					{[1, 2, 3, 4].map((i) => (
						<Card
							key={i}
							className='animate-pulse'
						>
							<CardHeader className='space-y-0 pb-2'>
								<div className='h-4 w-24 bg-muted rounded'></div>
							</CardHeader>
							<CardContent>
								<div className='h-7 w-12 bg-muted rounded mb-1'></div>
								<div className='h-3 w-20 bg-muted rounded'></div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-3xl font-bold tracking-tight'>
						Client Dashboard
					</h1>
					<p className='text-destructive'>{error}</p>
					<Button
						onClick={() => window.location.reload()}
						className='w-fit mt-2'
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>Client Dashboard</h1>
				<p className='text-muted-foreground'>
					Welcome back
					{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}! Here
					is an overview of your services and bookings.
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Active Bookings
						</CardTitle>
						<Calendar className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{stats?.activeBookings || 0}
						</div>
						<p className='text-xs text-muted-foreground'>
							{stats?.upcomingBookings || 0} upcoming this week
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Favorite Services
						</CardTitle>
						<Heart className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{stats?.totalFavorites || 0}
						</div>
						<p className='text-xs text-muted-foreground'>
							{stats?.favoriteServices || 0} services,{" "}
							{stats?.favoriteProviders || 0} providers
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Spent</CardTitle>
						<CreditCard className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							${stats?.totalSpent?.toFixed(2) || "0.00"}
						</div>
						<p className='text-xs text-muted-foreground'>
							Over the past 3 months
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Reviews Given</CardTitle>
						<Star className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats?.reviewsGiven || 0}</div>
						<p className='text-xs text-muted-foreground'>
							Average rating: {stats?.averageRating?.toFixed(1) || "0.0"}
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
					<TabsTrigger value='recent'>Recent Services</TabsTrigger>
					<TabsTrigger value='recommended'>Recommended For You</TabsTrigger>
				</TabsList>
				<TabsContent
					value='upcoming'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Upcoming Bookings</CardTitle>
							<CardDescription>
								Your scheduled services for the next few days
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{upcomingBookings.length === 0 ? (
								<div className='text-center py-6'>
									<p className='text-muted-foreground'>
										You do not have any upcoming bookings
									</p>
									<Link href='/services'>
										<Button className='mt-4'>Browse Services</Button>
									</Link>
								</div>
							) : (
								<>
									{upcomingBookings.map((booking) => (
										<div
											key={booking.id}
											className='flex items-center justify-between rounded-lg border p-4'
										>
											<div>
												<p className='font-medium'>{booking.serviceName}</p>
												<p className='text-sm text-muted-foreground'>
													{booking.providerName}
												</p>
											</div>
											<div className='flex items-center gap-4'>
												<div className='text-right'>
													<p className='text-sm font-medium'>
														{formatDate(booking.date)}
													</p>
													<p className='text-xs text-muted-foreground capitalize'>
														{booking.status}
													</p>
												</div>
												<Link href={`/client-dashboard/bookings`}>
													<Button
														variant='ghost'
														size='icon'
													>
														<Calendar className='h-4 w-4' />
														<span className='sr-only'>View booking</span>
													</Button>
												</Link>
											</div>
										</div>
									))}
									<Link href='/client-dashboard/bookings'>
										<Button
											variant='outline'
											className='w-full'
										>
											View all bookings
										</Button>
									</Link>
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent
					value='recent'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Recent Services</CardTitle>
							<CardDescription>Services you have used recently</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{recentServices.length === 0 ? (
								<div className='text-center py-6'>
									<p className='text-muted-foreground'>
										You have not used any services recently
									</p>
								</div>
							) : (
								<>
									{recentServices.map((service) => (
										<div
											key={service.id}
											className='flex items-center justify-between rounded-lg border p-4'
										>
											<div>
												<p className='font-medium'>{service.serviceName}</p>
												<p className='text-sm text-muted-foreground'>
													{service.providerName}
												</p>
											</div>
											<div className='flex items-center gap-4'>
												<div className='text-right'>
													<div className='flex items-center'>
														{Array(5)
															.fill(0)
															.map((_, i) => (
																<Star
																	key={i}
																	className={`h-4 w-4 ${
																		i < (service.rating || 0)
																			? "fill-yellow-400 text-yellow-400"
																			: "text-muted"
																	}`}
																/>
															))}
													</div>
													<p className='text-xs text-muted-foreground'>
														{formatDate(service.date)}
													</p>
												</div>
												<Link href='/client-dashboard/reviews'>
													<Button
														variant='ghost'
														size='icon'
													>
														<Star className='h-4 w-4' />
														<span className='sr-only'>Review</span>
													</Button>
												</Link>
											</div>
										</div>
									))}
									<Link href='/client-dashboard/reviews'>
										<Button
											variant='outline'
											className='w-full'
										>
											View all services
										</Button>
									</Link>
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent
					value='recommended'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Recommended For You</CardTitle>
							<CardDescription>
								Based on your service history and preferences
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='text-center py-6'>
								<p className='text-muted-foreground'>
									Recommendations will appear as you use more services
								</p>
								<Link href='/services'>
									<Button className='mt-4'>Browse Services</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common tasks you might want to do</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-3'>
						<Link href='/services'>
							<Button
								variant='outline'
								className='w-full h-auto py-4 flex flex-col items-center gap-2'
							>
								<Shield className='h-6 w-6' />
								<span>Browse Services</span>
							</Button>
						</Link>
						<Link href='/services'>
							<Button
								variant='outline'
								className='w-full h-auto py-4 flex flex-col items-center gap-2'
							>
								<Calendar className='h-6 w-6' />
								<span>Book a Service</span>
							</Button>
						</Link>
						<Link href='/client-dashboard/messages'>
							<Button
								variant='outline'
								className='w-full h-auto py-4 flex flex-col items-center gap-2'
							>
								<MessageSquare className='h-6 w-6' />
								<span>Contact Support</span>
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
