/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	Clock,
	MapPin,
	MoreHorizontal,
	Search,
	CheckCircle,
	Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import Link from "next/link";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createReview } from "@/lib/client-db";
// import { useRouter } from "next/navigation";

export default function ClientBookingsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [bookings, setBookings] = useState<any[]>([]);
	const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("upcoming");
	const [selectedBooking, setSelectedBooking] = useState<any>(null);
	const [cancellationReason, setCancellationReason] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [reviewDialog, setReviewDialog] = useState<any>(null);
	const [reviewBooking, setReviewBooking] = useState<any>(null);
	const [reviewRating, setReviewRating] = useState(5);
	const [reviewText, setReviewText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { user } = useAuth();
	const { toast } = useToast();
	// const router = useRouter();

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
				where("clientId", "==", user.uid),
				orderBy("date", "desc")
			);

			const querySnapshot = await getDocs(q);
			const bookingsList: any[] = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// console.log(data, "Booking data fetched from Firestore");
				// Convert Firestore timestamp to JavaScript Date object
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
		// console.log("Filtering ghgfhgfh", filtered);

		// Filter by search term
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			filtered = filtered?.filter(
				(booking) =>
					booking.serviceName?.toLowerCase().includes(term) ||
					booking.providerName?.toLowerCase().includes(term)
			);
		}

		// Filter by tab
		const now = new Date();
		switch (activeTab) {
			case "upcoming":
				// console.log("Filtering upcoming bookings", filtered);
				filtered = filtered?.filter(
					(booking) =>
						(booking.date > now || isSameDay(booking.date, now)) &&
						(booking.status === "pending" ||
							booking.status === "confirmed" ||
							booking.status === "in_progress")
				);
				// console.log("Filtered upcoming bookings", filtered);
				break;
			case "past":
				filtered = filtered?.filter(
					(booking) => booking.status === "completed"
				);
				break;
			case "cancelled":
				filtered = filtered?.filter(
					(booking) => booking.status === "cancelled"
				);
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
				return "default"; // Map "warning" to a supported variant
			case "completed":
				return "secondary"; // Map "success" to a supported variant
			case "cancelled":
				return "destructive";
			default:
				return "outline";
		}
	};

	const handleCancelBooking = async () => {
		if (!selectedBooking) return;

		setIsUpdating(true);
		try {
			const bookingRef = doc(db, "bookings", selectedBooking.id);
			await updateDoc(bookingRef, {
				status: "cancelled",
				reason: cancellationReason,
				updatedAt: serverTimestamp(),
			});

			toast({
				title: "Booking Cancelled",
				description: "Your booking has been cancelled successfully",
			});

			// Refresh bookings
			fetchBookings();
			setSelectedBooking(null);
			setCancellationReason("");
		} catch (error) {
			console.error("Error cancelling booking:", error);
			toast({
				title: "Error",
				description: "Failed to cancel booking",
				variant: "destructive",
			});
		} finally {
			setIsUpdating(false);
		}
	};

	const handleCompleteService = async (booking: any) => {
		setIsUpdating(true);
		setReviewBooking(booking);
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
			setReviewDialog(true);
			// router.push("/client-dashboard/reviews?service=" + booking.serviceId);
		} catch (error) {
			console.error("Error completing service:", error);
			toast({
				title: "Error",
				description: "Failed to complete service",
				variant: "destructive",
			});
		} finally {
			setIsUpdating(false);
		}
	};

	const handleSubmitReview = async (pendingReview: any) => {
		if (!user) return;

		setIsSubmitting(true);
		try {
			await createReview({
				serviceId: pendingReview.serviceId,
				serviceName: pendingReview.serviceName,
				providerId: pendingReview.providerId,
				providerName: pendingReview.providerName,
				clientId: user.uid,
				clientName: user.displayName || "Client",
				rating: reviewRating,
				comment: reviewText,
			});

			toast({
				title: "Review submitted",
				description: "Your review has been submitted successfully",
			});

			setReviewText("");
			setReviewRating(5);
			setReviewDialog(null);
			setReviewBooking(null);
		} catch (error) {
			console.error("Error submitting review:", error);
			toast({
				title: "Error",
				description: "Failed to submit review",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

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
				onValueChange={setActiveTab}
			>
				<TabsList>
					<TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
					<TabsTrigger value='past'>Past</TabsTrigger>
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
					) : filteredBookings?.length === 0 ? (
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
											No {activeTab} bookings
										</p>
										<p className='text-muted-foreground mb-4'>
											You do not have any {activeTab} service appointments
										</p>
										{activeTab === "upcoming" && (
											<Link href='/services'>
												<Button>Book a Service</Button>
											</Link>
										)}
									</>
								)}
							</CardContent>
						</Card>
					) : (
						filteredBookings?.map((booking) => (
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
												{booking.providerName}
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
											{booking.status === "in_progress" && (
												<Button
													variant='outline'
													size='sm'
													className='flex items-center gap-2'
													onClick={() => handleCompleteService(booking)}
													disabled={isUpdating}
												>
													<CheckCircle className='h-4 w-4' />
													Mark as Completed
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
													<DropdownMenuItem>Contact Provider</DropdownMenuItem>
													{booking.status === "in_progress" && (
														<DropdownMenuItem
															onClick={() => handleCompleteService(booking)}
														>
															Mark as Completed
														</DropdownMenuItem>
													)}
													{(booking.status === "pending" ||
														booking.status === "confirmed") && (
														<>
															<DropdownMenuItem>Reschedule</DropdownMenuItem>
															<DropdownMenuItem
																className='text-destructive'
																onClick={() => setSelectedBooking(booking)}
															>
																Cancel Booking
															</DropdownMenuItem>
														</>
													)}
													{booking.status === "completed" && (
														<DropdownMenuItem asChild>
															<Link
																href={`/client-dashboard/reviews?service=${booking.serviceId}`}
															>
																Leave a Review
															</Link>
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>
			</Tabs>

			{/* Cancellation Dialog */}
			<Dialog
				open={!!selectedBooking}
				onOpenChange={(open) => !open && setSelectedBooking(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Booking</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel this booking? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-4 py-4'>
						<div className='space-y-2'>
							<p className='text-sm font-medium'>Booking Details:</p>
							<p className='text-sm'>
								{selectedBooking?.serviceName} on{" "}
								{selectedBooking?.date?.toLocaleDateString()}
							</p>
						</div>
						<div className='space-y-2'>
							<label
								htmlFor='reason'
								className='text-sm font-medium'
							>
								Reason for cancellation (optional)
							</label>
							<Textarea
								id='reason'
								placeholder='Please provide a reason for cancellation'
								value={cancellationReason}
								onChange={(e) => setCancellationReason(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setSelectedBooking(null)}
						>
							Keep Booking
						</Button>
						<Button
							variant='destructive'
							onClick={handleCancelBooking}
							disabled={isUpdating}
						>
							{isUpdating ? "Cancelling..." : "Cancel Booking"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog
				open={!!reviewDialog}
				onOpenChange={(open) => !open && setReviewDialog(null)}
			>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Write a Review</DialogTitle>
						<DialogDescription>
							Share your experience with {reviewBooking?.serviceName} by{" "}
							{reviewBooking?.providerName}
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='space-y-2'>
							<Label htmlFor='rating'>Rating</Label>
							<div className='flex gap-2'>
								{[1, 2, 3, 4, 5].map((rating) => (
									<Button
										key={rating}
										type='button'
										variant={reviewRating === rating ? "default" : "outline"}
										size='sm'
										onClick={() => setReviewRating(rating)}
										className='w-10 h-10 p-0'
									>
										{rating}
									</Button>
								))}
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='comment'>Your Review</Label>
							<Textarea
								id='comment'
								placeholder='Share your experience with this service...'
								value={reviewText}
								onChange={(e) => setReviewText(e.target.value)}
								rows={4}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type='submit'
							onClick={() => handleSubmitReview(reviewBooking)}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Submitting...
								</>
							) : (
								"Submit Review"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
