/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
	getUpcomingBookings,
	getPastBookings,
	getCancelledBookings,
	cancelBooking,
} from "@/lib/client-db";
import { format, isAfter } from "date-fns";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ClientBookingsPage() {
	const { user } = useAuth();
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
	const [pastBookings, setPastBookings] = useState<any[]>([]);
	const [cancelledBookings, setCancelledBookings] = useState<any[]>([]);
	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [cancelReason, setCancelReason] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBookings = async () => {
			if (!user) return;

			try {
				setLoading(true);

				// Fetch all types of bookings
				const [upcoming, past, cancelled] = await Promise.all([
					getUpcomingBookings(user.uid, 100),
					getPastBookings(user.uid, 100),
					getCancelledBookings(user.uid),
				]);

				setUpcomingBookings(upcoming);
				setPastBookings(past.filter((b) => b.status === "completed"));
				setCancelledBookings(cancelled);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching bookings:", error);
				setError("Failed to load bookings. Please try again.");
				setLoading(false);
			}
		};

		fetchBookings();
	}, [user]);

	// Filter bookings based on search term
	const filterBookings = (bookingList: any[]) => {
		if (!searchTerm) return bookingList;

		const term = searchTerm.toLowerCase();
		return bookingList.filter(
			(booking) =>
				booking.serviceName?.toLowerCase().includes(term) ||
				booking.providerName?.toLowerCase().includes(term) ||
				booking.businessName?.toLowerCase().includes(term)
		);
	};

	// Format date for display
	const formatDate = (date: Date | any) => {
		if (!date) return "";
		const dateObj = date instanceof Date ? date : date.toDate();

		if (isAfter(dateObj, new Date())) {
			// For upcoming dates, show day and time
			return format(dateObj, "EEE, MMM d 'at' h:mm a");
		}

		// For past dates, just show the date
		return format(dateObj, "MMM d, yyyy");
	};

	// Get status badge variant
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "confirmed":
				return "default";
			case "pending":
				return "secondary";
			case "completed":
				return "default"; // Map "success" to "default" or another valid value
			case "cancelled":
				return "destructive";
			default:
				return "outline";
		}
	};

	// Handle booking cancellation
	const handleCancelBooking = async () => {
		if (!selectedBooking || !cancelReason.trim()) return;

		try {
			await cancelBooking(selectedBooking.id, cancelReason);

			// Update local state
			const updatedBooking = {
				...selectedBooking,
				status: "cancelled",
				reason: cancelReason,
			};
			setUpcomingBookings(
				upcomingBookings.filter((b) => b.id !== selectedBooking.id)
			);
			setCancelledBookings([updatedBooking, ...cancelledBookings]);

			toast({
				title: "Booking cancelled",
				description: "Your booking has been successfully cancelled.",
			});

			setSelectedBooking(null);
			setCancelReason("");
		} catch (error) {
			console.error("Error cancelling booking:", error);
			toast({
				title: "Error",
				description: "Failed to cancel booking. Please try again.",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return (
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-3xl font-bold tracking-tight'>My Bookings</h1>
					<p className='text-muted-foreground'>Loading your bookings...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-3xl font-bold tracking-tight'>My Bookings</h1>
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
			<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Bookings</h1>
					<p className='text-muted-foreground'>
						View and manage your service bookings
					</p>
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
					<Link href='/services'>
						<Button>Book New Service</Button>
					</Link>
				</div>
			</div>

			<Tabs
				defaultValue='upcoming'
				className='w-full'
			>
				<TabsList>
					<TabsTrigger value='upcoming'>
						Upcoming ({upcomingBookings.length})
					</TabsTrigger>
					<TabsTrigger value='past'>Past ({pastBookings.length})</TabsTrigger>
					<TabsTrigger value='cancelled'>
						Cancelled ({cancelledBookings.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='upcoming'
					className='space-y-4'
				>
					{filterBookings(upcomingBookings).length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10 text-center'>
								<Calendar className='h-10 w-10 text-muted-foreground mb-4' />
								{searchTerm ? (
									<>
										<p className='mb-2 text-lg font-medium'>
											No matching bookings found
										</p>
										<p className='text-muted-foreground'>
											Try adjusting your search term
										</p>
									</>
								) : (
									<>
										<p className='mb-2 text-lg font-medium'>
											No upcoming bookings
										</p>
										<p className='text-muted-foreground mb-4'>
											You do not have any upcoming service appointments
										</p>
										<Link href='/services'>
											<Button>Book a Service</Button>
										</Link>
									</>
								)}
							</CardContent>
						</Card>
					) : (
						filterBookings(upcomingBookings).map((booking) => (
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
													{booking.status}
												</Badge>
											</div>
											<p className='text-muted-foreground'>
												{booking.providerName}
											</p>
										</div>
										<div className='flex flex-col gap-1 md:items-end'>
											<p className='font-medium'>{formatDate(booking.date)}</p>
											<p className='text-sm text-muted-foreground'>
												${booking.price?.toFixed(2)}
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
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'
													>
														<MoreHorizontal className='h-4 w-4' />
														<span className='sr-only'>Actions</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem>View Details</DropdownMenuItem>
													<DropdownMenuItem>Contact Provider</DropdownMenuItem>
													<DropdownMenuItem>Reschedule</DropdownMenuItem>
													<Dialog>
														<DialogTrigger asChild>
															<DropdownMenuItem
																className='text-destructive'
																onSelect={(e) => {
																	e.preventDefault();
																	setSelectedBooking(booking);
																}}
															>
																Cancel Booking
															</DropdownMenuItem>
														</DialogTrigger>
														<DialogContent>
															<DialogHeader>
																<DialogTitle>Cancel Booking</DialogTitle>
																<DialogDescription>
																	Are you sure you want to cancel this booking?
																	This action cannot be undone.
																</DialogDescription>
															</DialogHeader>
															<div className='py-4'>
																<div className='space-y-2'>
																	<h4 className='font-medium'>
																		Booking Details
																	</h4>
																	<p className='text-sm'>
																		{booking.serviceName}
																	</p>
																	<p className='text-sm text-muted-foreground'>
																		{formatDate(booking.date)}
																	</p>
																</div>
																<div className='space-y-2 mt-4'>
																	<h4 className='font-medium'>
																		Reason for cancellation
																	</h4>
																	<Textarea
																		placeholder='Please provide a reason for cancellation'
																		value={cancelReason}
																		onChange={(e) =>
																			setCancelReason(e.target.value)
																		}
																	/>
																</div>
															</div>
															<DialogFooter>
																<Button
																	variant='outline'
																	onClick={() => {
																		setSelectedBooking(null);
																		setCancelReason("");
																	}}
																>
																	Keep Booking
																</Button>
																<Button
																	variant='destructive'
																	onClick={handleCancelBooking}
																	disabled={!cancelReason.trim()}
																>
																	Cancel Booking
																</Button>
															</DialogFooter>
														</DialogContent>
													</Dialog>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>

				<TabsContent
					value='past'
					className='space-y-4'
				>
					{filterBookings(pastBookings).length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10 text-center'>
								<Calendar className='h-10 w-10 text-muted-foreground mb-4' />
								{searchTerm ? (
									<>
										<p className='mb-2 text-lg font-medium'>
											No matching bookings found
										</p>
										<p className='text-muted-foreground'>
											Try adjusting your search term
										</p>
									</>
								) : (
									<>
										<p className='mb-2 text-lg font-medium'>No past bookings</p>
										<p className='text-muted-foreground'>
											You have not used any services yet
										</p>
									</>
								)}
							</CardContent>
						</Card>
					) : (
						filterBookings(pastBookings).map((booking) => (
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
													{booking.status}
												</Badge>
											</div>
											<p className='text-muted-foreground'>
												{booking.providerName}
											</p>
										</div>
										<div className='flex flex-col gap-1 md:items-end'>
											<p className='font-medium'>{formatDate(booking.date)}</p>
											<p className='text-sm text-muted-foreground'>
												${booking.price?.toFixed(2)}
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
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'
													>
														<MoreHorizontal className='h-4 w-4' />
														<span className='sr-only'>Actions</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem>View Details</DropdownMenuItem>
													<DropdownMenuItem>Leave a Review</DropdownMenuItem>
													<DropdownMenuItem>Book Again</DropdownMenuItem>
													<DropdownMenuItem>Contact Provider</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>

				<TabsContent
					value='cancelled'
					className='space-y-4'
				>
					{filterBookings(cancelledBookings).length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10 text-center'>
								<Calendar className='h-10 w-10 text-muted-foreground mb-4' />
								{searchTerm ? (
									<>
										<p className='mb-2 text-lg font-medium'>
											No matching bookings found
										</p>
										<p className='text-muted-foreground'>
											Try adjusting your search term
										</p>
									</>
								) : (
									<>
										<p className='mb-2 text-lg font-medium'>
											No cancelled bookings
										</p>
										<p className='text-muted-foreground'>
											You do not have any cancelled bookings
										</p>
									</>
								)}
							</CardContent>
						</Card>
					) : (
						filterBookings(cancelledBookings).map((booking) => (
							<Card key={booking.id}>
								<CardContent className='p-6'>
									<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
										<div className='space-y-1'>
											<div className='flex items-center gap-2'>
												<h3 className='font-semibold text-lg'>
													{booking.serviceName}
												</h3>
												<Badge
													variant='destructive'
													className='capitalize'
												>
													{booking.status}
												</Badge>
											</div>
											<p className='text-muted-foreground'>
												{booking.providerName}
											</p>
										</div>
										<div className='flex flex-col gap-1 md:items-end'>
											<p className='font-medium'>{formatDate(booking.date)}</p>
											<p className='text-sm text-muted-foreground'>
												${booking.price?.toFixed(2)}
											</p>
										</div>
									</div>

									<div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-3'>
										<div className='flex items-center gap-2 text-sm text-muted-foreground'>
											<MapPin className='h-4 w-4 flex-shrink-0' />
											<span>{booking.address || "No address provided"}</span>
										</div>
										<div className='flex items-center gap-2 text-sm text-muted-foreground col-span-2'>
											<span className='font-medium'>Reason:</span>
											<span>{booking.reason || "No reason provided"}</span>
										</div>
									</div>

									<div className='mt-4 flex justify-end'>
										<Link href={`/services/${booking.serviceId}`}>
											<Button
												variant='outline'
												size='sm'
											>
												Book Again
											</Button>
										</Link>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
