/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Calendar,
	Clock,
	MapPin,
	MoreHorizontal,
	Search,
	Play,
	CheckCircle,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
	collection,
	query,
	where,
	orderBy,
	getDocs,
	doc,
	updateDoc,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProviderBookingsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [bookings, setBookings] = useState<any[]>([]);
	const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("upcoming");
	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [isUpdating, setIsUpdating] = useState(false);

	const { user } = useAuth();
	const { toast } = useToast();

	useEffect(() => {
		if (user) {
			fetchBookings();
		}
	}, [user]);

	useEffect(() => {
		filterBookings();
	}, [bookings, searchTerm, activeTab]);

	const fetchBookings = async () => {
		if (!user) return;

		setLoading(true);
		try {
			const bookingsRef = collection(db, "bookings");
			const q = query(
				bookingsRef,
				where("providerId", "==", user.uid),
				orderBy("date", "desc")
			);

			const querySnapshot = await getDocs(q);
			const bookingsList: any[] = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				bookingsList.push({
					id: doc.id,
					...data,
					date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
				});
			});

			setBookings(bookingsList);
		} catch (error) {
			console.error("Error fetching bookings:", error);
			toast({
				title: "Error",
				description: "Failed to load bookings",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const filterBookings = () => {
		if (!bookings) return;

		let filtered = [...bookings];

		// Filter by search term
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(booking) =>
					booking.serviceName?.toLowerCase().includes(term) ||
					booking.clientName?.toLowerCase().includes(term) ||
					booking.clientEmail?.toLowerCase().includes(term)
			);
		}

		// Filter by tab
		const now = new Date();
		switch (activeTab) {
			case "upcoming":
				filtered = filtered.filter(
					(booking) =>
						(booking.date > now || isSameDay(booking.date, now)) &&
						(booking.status === "pending" || booking.status === "confirmed")
				);
				break;
			case "ongoing":
				filtered = filtered.filter(
					(booking) => booking.status === "in_progress"
				);
				break;
			case "completed":
				filtered = filtered.filter((booking) => booking.status === "completed");
				break;
			case "cancelled":
				filtered = filtered.filter((booking) => booking.status === "cancelled");
				break;
		}

		setFilteredBookings(filtered);
	};

	const isSameDay = (date1: Date, date2: Date) => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	const formatDate = (date: Date) => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (isSameDay(date, today)) {
			return `Today, ${date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}`;
		} else if (isSameDay(date, tomorrow)) {
			return `Tomorrow, ${date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}`;
		} else {
			return (
				date.toLocaleDateString([], {
					weekday: "short",
					month: "short",
					day: "numeric",
				}) +
				`, ${date.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})}`
			);
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return "secondary";
			case "confirmed":
				return "default";
			case "in_progress":
				return "outline"; // Map "warning" to "outline"
			case "completed":
				return "default"; // Map "success" to "default"
			case "cancelled":
				return "destructive";
			default:
				return "outline";
		}
	};

	const handleStartService = async (booking: any) => {
		setSelectedBooking(booking);
		setIsUpdating(true);

		try {
			const bookingRef = doc(db, "bookings", booking.id);
			await updateDoc(bookingRef, {
				status: "in_progress",
				startedAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});

			toast({
				title: "Service Started",
				description: "The service has been marked as in progress",
			});

			// Refresh bookings
			fetchBookings();
		} catch (error) {
			console.error("Error starting service:", error);
			toast({
				title: "Error",
				description: "Failed to start service",
				variant: "destructive",
			});
		} finally {
			setIsUpdating(false);
			setSelectedBooking(null);
		}
	};

	const handleCompleteService = async (booking: any) => {
		setSelectedBooking(booking);
		setIsUpdating(true);

		try {
			const bookingRef = doc(db, "bookings", booking.id);
			await updateDoc(bookingRef, {
				status: "completed",
				completedAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});

			toast({
				title: "Service Completed",
				description: "The service has been marked as completed",
			});

			// Refresh bookings
			fetchBookings();
		} catch (error) {
			console.error("Error completing service:", error);
			toast({
				title: "Error",
				description: "Failed to complete service",
				variant: "destructive",
			});
		} finally {
			setIsUpdating(false);
			setSelectedBooking(null);
		}
	};

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Bookings</h1>
					<p className='text-muted-foreground'>Manage your service bookings</p>
				</div>
				<div className='flex items-center gap-2'>
					<div className='relative w-full md:w-auto'>
						<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Search bookings...'
							className='w-full pl-8 md:w-[200px] lg:w-[300px]'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Button onClick={fetchBookings}>Refresh</Button>
				</div>
			</div>

			<Tabs
				defaultValue='upcoming'
				className='w-full'
				onValueChange={setActiveTab}
			>
				<TabsList>
					<TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
					<TabsTrigger value='ongoing'>In Progress</TabsTrigger>
					<TabsTrigger value='completed'>Completed</TabsTrigger>
					<TabsTrigger value='cancelled'>Cancelled</TabsTrigger>
				</TabsList>

				<TabsContent
					value={activeTab}
					className='space-y-4'
				>
					{loading ? (
						<Card>
							<CardContent className='flex items-center justify-center py-10'>
								<p>Loading bookings...</p>
							</CardContent>
						</Card>
					) : filteredBookings.length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10 text-center'>
								<Calendar className='h-10 w-10 text-muted-foreground mb-4' />
								<p className='mb-2 text-lg font-medium'>No bookings found</p>
								<p className='text-muted-foreground'>
									{searchTerm
										? "Try adjusting your search term"
										: `You don't have any ${activeTab} bookings`}
								</p>
							</CardContent>
						</Card>
					) : (
						filteredBookings.map((booking) => (
							<Card key={booking.id}>
								<CardContent className='p-6'>
									<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
										<div className='space-y-1'>
											<div className='flex items-center gap-2'>
												<h3 className='font-semibold text-lg'>
													{booking.serviceName}
												</h3>
												<Badge
													variant={getStatusBadge(booking.status)}
													className='capitalize'
												>
													{booking.status.replace("_", " ")}
												</Badge>
											</div>
											<p className='text-muted-foreground'>
												Client: {booking.clientName}
											</p>
											<p className='text-sm text-muted-foreground'>
												{booking.clientEmail}
											</p>
										</div>
										<div className='flex flex-col gap-1 md:items-end'>
											<p className='font-medium'>{formatDate(booking.date)}</p>
											<p className='text-sm text-muted-foreground'>
												${booking.price.toFixed(2)}
											</p>
										</div>
									</div>

									<div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-3'>
										<div className='flex items-center gap-2 text-sm text-muted-foreground'>
											<MapPin className='h-4 w-4 flex-shrink-0' />
											<span>{booking.address || "No address provided"}</span>
										</div>
										<div className='flex items-center gap-2 text-sm text-muted-foreground'>
											<Clock className='h-4 w-4 flex-shrink-0' />
											<span>{booking.duration} minutes</span>
										</div>
										<div className='flex justify-start md:justify-end'>
											{activeTab === "upcoming" && (
												<Button
													variant='outline'
													size='sm'
													className='flex items-center gap-2'
													onClick={() => handleStartService(booking)}
													disabled={
														isUpdating && selectedBooking?.id === booking.id
													}
												>
													<Play className='h-4 w-4' />
													Start Service
												</Button>
											)}
											{activeTab === "ongoing" && (
												<Button
													variant='outline'
													size='sm'
													className='flex items-center gap-2'
													onClick={() => handleCompleteService(booking)}
													disabled={
														isUpdating && selectedBooking?.id === booking.id
													}
												>
													<CheckCircle className='h-4 w-4' />
													Complete Service
												</Button>
											)}
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'
														className='ml-2'
													>
														<MoreHorizontal className='h-4 w-4' />
														<span className='sr-only'>Actions</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem>View Details</DropdownMenuItem>
													<DropdownMenuItem>Contact Client</DropdownMenuItem>
													{activeTab === "upcoming" && (
														<DropdownMenuItem
															onClick={() => handleStartService(booking)}
														>
															Start Service
														</DropdownMenuItem>
													)}
													{activeTab === "ongoing" && (
														<DropdownMenuItem
															onClick={() => handleCompleteService(booking)}
														>
															Complete Service
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>

									{booking.notes && (
										<div className='mt-4 border-t pt-4'>
											<p className='text-sm font-medium'>Notes:</p>
											<p className='text-sm text-muted-foreground'>
												{booking.notes}
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
