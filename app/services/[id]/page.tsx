/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Shield, Star, Clock, MapPin, ChevronLeft } from "lucide-react";
import {
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	orderBy,
	limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function ServiceDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const [service, setService] = useState<any>(null);
	const [provider, setProvider] = useState<any>(null);
	const [reviews, setReviews] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [bookingDate, setBookingDate] = useState("");

	const { user, userData } = useAuth();
	const { toast } = useToast();
	const router = useRouter();
	const { id } = use(params);

	useEffect(() => {
		const fetchServiceDetails = async () => {
			try {
				// Fetch service details
				const serviceDoc = await getDoc(doc(db, "services", id));

				if (!serviceDoc.exists()) {
					router.push("/services");
					return;
				}

				const serviceData: {
					id: string;
					providerId?: string;
					[key: string]: any;
				} = { id: serviceDoc.id, ...serviceDoc.data() };
				setService(serviceData);

				// Fetch provider details
				if (serviceData.providerId) {
					const providerDoc = await getDoc(
						doc(db, "users", serviceData.providerId)
					);
					if (providerDoc.exists()) {
						setProvider({ id: providerDoc.id, ...providerDoc.data() });
					}
				}

				// Fetch reviews
				const reviewsQuery = query(
					collection(db, "reviews"),
					where("serviceId", "==", id),
					orderBy("createdAt", "desc"),
					limit(5)
				);

				const reviewsSnapshot = await getDocs(reviewsQuery);
				const reviewsList: any[] = [];

				reviewsSnapshot.forEach((doc) => {
					reviewsList.push({ id: doc.id, ...doc.data() });
				});

				setReviews(reviewsList);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching service details:", error);
				setLoading(false);
			}
		};

		fetchServiceDetails();
	}, [id, router]);

	const handleBookService = async () => {
		if (!user) {
			toast({
				title: "Authentication required",
				description: "Please log in to book this service",
				variant: "destructive",
			});
			router.push(`/login?redirect=/services/${id}`);
			return;
		}

		if (!bookingDate) {
			toast({
				title: "Date required",
				description: "Please select a date for your booking",
				variant: "destructive",
			});
			return;
		}

		// In a real app, you would create a booking in the database
		// and redirect to a checkout page
		toast({
			title: "Booking initiated",
			description: "You will be redirected to complete your booking",
		});

		// Redirect to booking page with service ID
		router.push(`/booking?service=${id}&date=${bookingDate}`);
	};

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p>Loading service details...</p>
			</div>
		);
	}

	if (!service) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p>Service not found</p>
			</div>
		);
	}

	const getCategoryLabel = (categoryValue: string) => {
		const categories: Record<string, string> = {
			cleaning: "Cleaning",
			plumbing: "Plumbing",
			electrical: "Electrical",
			gardening: "Gardening",
			fitness: "Fitness",
			beauty: "Beauty & Spa",
			other: "Other",
		};
		return categories[categoryValue] || categoryValue;
	};

	return (
		<div className='flex min-h-screen flex-col'>
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container flex h-16 items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Shield className='h-6 w-6' />
						<span className='text-xl font-bold'>Fix-it</span>
					</div>
					<nav className='hidden md:flex items-center gap-6 text-sm'>
						<Link
							href='/'
							className='font-medium transition-colors hover:text-primary'
						>
							Home
						</Link>
						<Link
							href='/services'
							className='font-medium transition-colors text-primary'
						>
							Services
						</Link>
						<Link
							href='/about'
							className='font-medium transition-colors hover:text-primary'
						>
							About
						</Link>
						<Link
							href='/contact'
							className='font-medium transition-colors hover:text-primary'
						>
							Contact
						</Link>
					</nav>
					<div className='flex items-center gap-4'>
						{user ? (
							<Link
								href={`${
									userData?.role === "client"
										? "/client-dashboard"
										: "/dashboard"
								}`}
							>
								<Button size='sm'>Dashboard</Button>
							</Link>
						) : (
							<>
								<Link href='/login'>
									<Button
										variant='ghost'
										size='sm'
									>
										Log in
									</Button>
								</Link>
								<Link href='/signup'>
									<Button size='sm'>Sign up</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</header>

			<main className='flex-1 py-12'>
				<div className='container px-4 md:px-6'>
					<div className='mb-6'>
						<Link
							href='/services'
							className='inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
						>
							<ChevronLeft className='mr-1 h-4 w-4' />
							Back to Services
						</Link>
					</div>

					<div className='grid gap-6 lg:grid-cols-3'>
						<div className='lg:col-span-2 space-y-6'>
							<Card>
								<CardHeader>
									<div className='flex justify-between items-start'>
										<div>
											<CardTitle className='text-2xl'>{service.name}</CardTitle>
											<CardDescription className='mt-1'>
												{getCategoryLabel(service.category)}
											</CardDescription>
										</div>
										<div className='flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full'>
											<Star className='h-4 w-4 fill-primary text-primary' />
											<span className='font-medium'>
												{service.rating || "New"}
											</span>
										</div>
									</div>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div className='flex items-center gap-2 text-muted-foreground'>
											<Clock className='h-4 w-4' />
											<span>{service.duration} minutes</span>
										</div>
										<div className='flex items-center gap-2 text-muted-foreground'>
											<MapPin className='h-4 w-4' />
											<span>
												{service.businessName || service.providerName}
											</span>
										</div>
									</div>

									<div>
										<h3 className='text-lg font-semibold mb-2'>Description</h3>
										<p className='text-muted-foreground'>
											{service.description}
										</p>
									</div>

									<div>
										<h3 className='text-lg font-semibold mb-2'>Price</h3>
										<p className='text-2xl font-bold'>
											${service.price.toFixed(2)}
										</p>
									</div>
								</CardContent>
							</Card>

							{reviews.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>Customer Reviews</CardTitle>
									</CardHeader>
									<CardContent className='space-y-4'>
										{reviews.map((review) => (
											<div
												key={review.id}
												className='border-b pb-4 last:border-0 last:pb-0'
											>
												<div className='flex items-center gap-2 mb-2'>
													<div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold'>
														{review.clientName?.charAt(0) || "C"}
													</div>
													<div>
														<p className='font-medium'>{review.clientName}</p>
														<div className='flex items-center'>
															{[...Array(5)].map((_, i) => (
																<Star
																	key={i}
																	className={`h-3 w-3 ${
																		i < review.rating
																			? "fill-yellow-400 text-yellow-400"
																			: "fill-muted text-muted"
																	}`}
																/>
															))}
															<span className='text-xs ml-2 text-muted-foreground'>
																{new Date(
																	review.createdAt?.toDate()
																).toLocaleDateString()}
															</span>
														</div>
													</div>
												</div>
												<p className='text-sm text-muted-foreground'>
													{review.comment}
												</p>
											</div>
										))}
									</CardContent>
								</Card>
							)}
						</div>

						<div className='space-y-6'>
							<Card>
								<CardHeader>
									<CardTitle>Book this Service</CardTitle>
									<CardDescription>
										Select a date to book this service
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='space-y-2'>
										<label
											htmlFor='booking-date'
											className='text-sm font-medium'
										>
											Select Date
										</label>
										<input
											id='booking-date'
											type='date'
											className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
											min={new Date().toISOString().split("T")[0]}
											value={bookingDate}
											onChange={(e) => setBookingDate(e.target.value)}
										/>
									</div>
								</CardContent>
								<CardFooter>
									<Button
										className='w-full'
										onClick={handleBookService}
									>
										Book Now
									</Button>
								</CardFooter>
							</Card>

							{provider && (
								<Card>
									<CardHeader>
										<CardTitle>Service Provider</CardTitle>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div className='flex items-center gap-4'>
											<div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg'>
												{provider.displayName?.charAt(0) || "P"}
											</div>
											<div>
												<p className='font-medium'>{provider.displayName}</p>
												<p className='text-sm text-muted-foreground'>
													{provider.businessName || "Service Provider"}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-1'>
											<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
											<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
											<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
											<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
											<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
											<span className='text-sm ml-2'>(5.0)</span>
										</div>
										<p className='text-sm text-muted-foreground'>
											{provider.bio ||
												"Professional service provider with years of experience in the industry."}
										</p>
										<div className='flex gap-2 w-full'>
											<Link
												href={`/providers/${provider.id}`}
												className='flex-1'
											>
												<Button
													variant='outline'
													className='w-full'
												>
													View Profile
												</Button>
											</Link>
											<Link
												href={`/client-dashboard/messages?provider=${provider.id}`}
												className='flex-1'
											>
												<Button
													variant='default'
													className='w-full'
												>
													Message
												</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</div>
			</main>

			<footer className='w-full border-t bg-background py-6'>
				<div className='container flex flex-col items-center justify-between gap-4 md:flex-row'>
					<div className='flex items-center gap-2'>
						<Shield className='h-6 w-6' />
						<span className='text-lg font-bold'>Fix-it</span>
					</div>
					<p className='text-sm text-muted-foreground'>
						© {new Date().getFullYear()} Fix-it. All rights reserved.
					</p>
					<div className='flex gap-4'>
						<Link
							href='/terms'
							className='text-sm text-muted-foreground hover:text-foreground'
						>
							Terms
						</Link>
						<Link
							href='/privacy'
							className='text-sm text-muted-foreground hover:text-foreground'
						>
							Privacy
						</Link>
						<Link
							href='/contact'
							className='text-sm text-muted-foreground hover:text-foreground'
						>
							Contact
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
