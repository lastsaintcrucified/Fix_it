/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Search, Star, Trash, Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
	getClientReviews,
	getPendingReviews,
	createReview,
	updateReview,
	deleteReview,
} from "@/lib/client-db";

export default function ClientReviewsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [editReview, setEditReview] = useState<any>(null);
	const [reviewText, setReviewText] = useState("");
	const [reviewRating, setReviewRating] = useState(5);
	const [loading, setLoading] = useState(true);
	const [publishedReviews, setPublishedReviews] = useState<any[]>([]);
	const [pendingReviews, setPendingReviews] = useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const { user } = useAuth();
	const { toast } = useToast();

	useEffect(() => {
		if (user) {
			loadReviews();
		}
	}, [user]);

	const loadReviews = async () => {
		if (!user) return;

		setLoading(true);
		try {
			// Load published reviews
			const reviews = await getClientReviews(user.uid);
			setPublishedReviews(reviews);

			// Load pending reviews (completed bookings without reviews)
			const pending = await getPendingReviews(user.uid);
			setPendingReviews(pending);
		} catch (error) {
			console.error("Error loading reviews:", error);
			toast({
				title: "Error",
				description: "Failed to load reviews",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	// Filter reviews based on search term
	const filterReviews = (reviewList: any[]) => {
		if (!searchTerm) return reviewList;

		const term = searchTerm.toLowerCase();
		return reviewList.filter(
			(review) =>
				review.serviceName?.toLowerCase().includes(term) ||
				review.providerName?.toLowerCase().includes(term) ||
				review.comment?.toLowerCase().includes(term)
		);
	};

	// Handle edit review
	const handleEditReview = (review: any) => {
		setEditReview(review);
		setReviewText(review.comment);
		setReviewRating(review.rating);
	};

	// Handle save review
	const handleSaveReview = async () => {
		if (!editReview || !user) return;

		setIsSubmitting(true);
		try {
			await updateReview(editReview.id, {
				comment: reviewText,
				rating: reviewRating,
			});

			toast({
				title: "Review updated",
				description: "Your review has been updated successfully",
			});

			// Refresh reviews
			loadReviews();
			setEditReview(null);
		} catch (error) {
			console.error("Error updating review:", error);
			toast({
				title: "Error",
				description: "Failed to update review",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle submit new review
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

			// Refresh reviews
			loadReviews();
			setEditReview(null);
			setReviewText("");
			setReviewRating(5);
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

	// Handle delete review
	const handleDeleteReview = async (reviewId: string) => {
		if (!reviewId) return;

		setIsDeleting(true);
		try {
			await deleteReview(reviewId);

			toast({
				title: "Review deleted",
				description: "Your review has been deleted successfully",
			});

			// Refresh reviews
			loadReviews();
		} catch (error) {
			console.error("Error deleting review:", error);
			toast({
				title: "Error",
				description: "Failed to delete review",
				variant: "destructive",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Reviews</h1>
					<p className='text-muted-foreground'>Manage your service reviews</p>
				</div>
				<div className='relative w-full md:w-auto'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search reviews...'
						className='w-full pl-8 md:w-[200px] lg:w-[300px]'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<Tabs
				defaultValue='published'
				className='w-full'
			>
				<TabsList>
					<TabsTrigger value='published'>
						Published Reviews ({publishedReviews.length})
					</TabsTrigger>
					<TabsTrigger value='pending'>
						Pending Reviews ({pendingReviews.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='published'
					className='space-y-4'
				>
					{loading ? (
						<Card>
							<CardContent className='flex items-center justify-center py-10'>
								<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
							</CardContent>
						</Card>
					) : filterReviews(publishedReviews).length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10 text-center'>
								<Star className='h-10 w-10 text-muted-foreground mb-4' />
								{searchTerm ? (
									<>
										<p className='mb-2 text-lg font-medium'>
											No matching reviews found
										</p>
										<p className='text-muted-foreground'>
											Try adjusting your search term
										</p>
									</>
								) : (
									<>
										<p className='mb-2 text-lg font-medium'>No reviews yet</p>
										<p className='text-muted-foreground'>
											You have not published any reviews
										</p>
									</>
								)}
							</CardContent>
						</Card>
					) : (
						filterReviews(publishedReviews).map((review) => (
							<Card key={review.id}>
								<CardContent className='p-6'>
									<div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
										<div className='space-y-1'>
											<h3 className='font-semibold text-lg'>
												{review.serviceName}
											</h3>
											<p className='text-muted-foreground'>
												{review.providerName}
											</p>
											<div className='flex items-center mt-1'>
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`h-4 w-4 ${
															i < review.rating
																? "fill-yellow-400 text-yellow-400"
																: "text-muted"
														}`}
													/>
												))}
												<span className='ml-2 text-sm text-muted-foreground'>
													{review.createdAt?.toDate
														? review.createdAt.toDate().toLocaleDateString()
														: "Recent"}
												</span>
											</div>
										</div>
										<div className='flex gap-2'>
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant='outline'
														size='sm'
														onClick={() => handleEditReview(review)}
													>
														<Edit className='h-4 w-4 mr-2' />
														Edit
													</Button>
												</DialogTrigger>
												<DialogContent className='sm:max-w-[425px]'>
													<DialogHeader>
														<DialogTitle>Edit Review</DialogTitle>
														<DialogDescription>
															Update your review for {review.serviceName} by{" "}
															{review.providerName}
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
																		variant={
																			reviewRating === rating
																				? "default"
																				: "outline"
																		}
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
																value={reviewText}
																onChange={(e) => setReviewText(e.target.value)}
																rows={4}
															/>
														</div>
													</div>
													<DialogFooter>
														<Button
															type='submit'
															onClick={handleSaveReview}
															disabled={isSubmitting}
														>
															{isSubmitting ? (
																<>
																	<Loader2 className='mr-2 h-4 w-4 animate-spin' />
																	Saving...
																</>
															) : (
																"Save changes"
															)}
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
											<Button
												variant='ghost'
												size='sm'
												className='text-destructive'
												onClick={() => handleDeleteReview(review.id)}
												disabled={isDeleting}
											>
												{isDeleting ? (
													<Loader2 className='h-4 w-4 animate-spin mr-2' />
												) : (
													<Trash className='h-4 w-4 mr-2' />
												)}
												Delete
											</Button>
										</div>
									</div>
									<div className='mt-4'>
										<p className='text-sm'>{review.comment}</p>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>

				<TabsContent
					value='pending'
					className='space-y-4'
				>
					{loading ? (
						<Card>
							<CardContent className='flex items-center justify-center py-10'>
								<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
							</CardContent>
						</Card>
					) : filterReviews(pendingReviews).length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10 text-center'>
								<Star className='h-10 w-10 text-muted-foreground mb-4' />
								{searchTerm ? (
									<>
										<p className='mb-2 text-lg font-medium'>
											No matching pending reviews found
										</p>
										<p className='text-muted-foreground'>
											Try adjusting your search term
										</p>
									</>
								) : (
									<>
										<p className='mb-2 text-lg font-medium'>
											No pending reviews
										</p>
										<p className='text-muted-foreground'>
											You do not have any services waiting for reviews
										</p>
									</>
								)}
							</CardContent>
						</Card>
					) : (
						filterReviews(pendingReviews).map((booking) => (
							<Card key={booking.id}>
								<CardContent className='p-6'>
									<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
										<div className='space-y-1'>
											<h3 className='font-semibold text-lg'>
												{booking.serviceName}
											</h3>
											<p className='text-muted-foreground'>
												{booking.providerName}
											</p>
											<p className='text-sm text-muted-foreground'>
												Service completed:{" "}
												{booking.date?.toDate
													? booking.date.toDate().toLocaleDateString()
													: "Recently"}
											</p>
										</div>
										<div>
											<Dialog>
												<DialogTrigger asChild>
													<Button>Write Review</Button>
												</DialogTrigger>
												<DialogContent className='sm:max-w-[425px]'>
													<DialogHeader>
														<DialogTitle>Write a Review</DialogTitle>
														<DialogDescription>
															Share your experience with {booking.serviceName}{" "}
															by {booking.providerName}
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
																		variant={
																			reviewRating === rating
																				? "default"
																				: "outline"
																		}
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
															onClick={() => handleSubmitReview(booking)}
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
