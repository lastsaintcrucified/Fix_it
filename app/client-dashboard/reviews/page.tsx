"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Search, Star, Trash } from "lucide-react";
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

export default function ClientReviewsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [editReview, setEditReview] = useState<any>(null);
	const [reviewText, setReviewText] = useState("");
	const [reviewRating, setReviewRating] = useState(5);

	// Sample reviews data
	const reviews = {
		published: [
			{
				id: 1,
				service: "Basic Home Cleaning",
				provider: "Smith's Professional Services",
				date: "May 20, 2023",
				rating: 5,
				comment:
					"Excellent service! The cleaner was thorough and professional. My home has never looked better.",
			},
			{
				id: 2,
				service: "Plumbing Repair",
				provider: "Garcia Home Services",
				date: "May 15, 2023",
				rating: 4,
				comment:
					"Good job fixing my leaky faucet. Arrived on time and completed the work efficiently.",
			},
			{
				id: 3,
				service: "Haircut and Style",
				provider: "Serenity Spa & Beauty",
				date: "May 5, 2023",
				rating: 5,
				comment:
					"Love my new haircut! The stylist listened to what I wanted and delivered perfectly.",
			},
		],
		pending: [
			{
				id: 4,
				service: "Lawn Mowing",
				provider: "Green Thumb Gardening",
				date: "Yesterday",
			},
			{
				id: 5,
				service: "Electrical Outlet Installation",
				provider: "Johnson's Electrical Solutions",
				date: "Last week",
			},
		],
	};

	// Filter reviews based on search term
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const filterReviews = (reviewList: any[]) => {
		if (!searchTerm) return reviewList;

		const term = searchTerm.toLowerCase();
		return reviewList.filter(
			(review) =>
				review.service?.toLowerCase().includes(term) ||
				review.provider?.toLowerCase().includes(term) ||
				review.comment?.toLowerCase().includes(term)
		);
	};

	// Handle edit review
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleEditReview = (review: any) => {
		setEditReview(review);
		setReviewText(review.comment);
		setReviewRating(review.rating);
	};

	// Handle save review
	const handleSaveReview = () => {
		// In a real app, you would update the review in the database
		console.log("Saving review:", {
			...editReview,
			comment: reviewText,
			rating: reviewRating,
		});
		setEditReview(null);
	};

	// Handle submit new review
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSubmitReview = (pendingReview: any) => {
		// In a real app, you would save the new review to the database
		console.log("Submitting new review:", {
			...pendingReview,
			comment: reviewText,
			rating: reviewRating,
		});
		setEditReview(null);
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
						Published Reviews ({reviews.published.length})
					</TabsTrigger>
					<TabsTrigger value='pending'>
						Pending Reviews ({reviews.pending.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='published'
					className='space-y-4'
				>
					{filterReviews(reviews.published).length === 0 ? (
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
						filterReviews(reviews.published).map((review) => (
							<Card key={review.id}>
								<CardContent className='p-6'>
									<div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
										<div className='space-y-1'>
											<h3 className='font-semibold text-lg'>
												{review.service}
											</h3>
											<p className='text-muted-foreground'>{review.provider}</p>
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
													{review.date}
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
															Update your review for {review.service} by{" "}
															{review.provider}
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
														>
															Save changes
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
											<Button
												variant='ghost'
												size='sm'
												className='text-destructive'
											>
												<Trash className='h-4 w-4 mr-2' />
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
					{filterReviews(reviews.pending).length === 0 ? (
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
						filterReviews(reviews.pending).map((review) => (
							<Card key={review.id}>
								<CardContent className='p-6'>
									<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
										<div className='space-y-1'>
											<h3 className='font-semibold text-lg'>
												{review.service}
											</h3>
											<p className='text-muted-foreground'>{review.provider}</p>
											<p className='text-sm text-muted-foreground'>
												Service completed: {review.date}
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
															Share your experience with {review.service} by{" "}
															{review.provider}
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
															onClick={() => handleSubmitReview(review)}
														>
															Submit Review
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
