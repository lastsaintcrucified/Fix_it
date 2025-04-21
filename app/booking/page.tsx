/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
	doc,
	getDoc,
	collection,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function BookingPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const serviceId = searchParams.get("service");
	const selectedDate = searchParams.get("date");

	const { user } = useAuth();
	const { toast } = useToast();

	const [service, setService] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [bookingDetails, setBookingDetails] = useState({
		address: "",
		notes: "",
		paymentMethod: "credit_card",
	});

	useEffect(() => {
		// Redirect if not logged in
		if (!user && !loading) {
			router.push(
				`/login?redirect=/booking?service=${serviceId}&date=${selectedDate}`
			);
			return;
		}

		// Fetch service details
		const fetchServiceDetails = async () => {
			if (!serviceId) {
				toast({
					title: "Error",
					description: "No service selected",
					variant: "destructive",
				});
				router.push("/services");
				return;
			}

			try {
				const serviceDoc = await getDoc(doc(db, "services", serviceId));

				if (!serviceDoc.exists()) {
					toast({
						title: "Error",
						description: "Service not found",
						variant: "destructive",
					});
					router.push("/services");
					return;
				}

				setService({ id: serviceDoc.id, ...serviceDoc.data() });
				setLoading(false);
			} catch (error) {
				console.error("Error fetching service:", error);
				toast({
					title: "Error",
					description: "Failed to load service details",
					variant: "destructive",
				});
				router.push("/services");
			}
		};

		if (serviceId) {
			fetchServiceDetails();
		}
	}, [serviceId, selectedDate, user, loading, router, toast]);

	const handleSubmitBooking = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user || !service || !selectedDate) {
			toast({
				title: "Error",
				description: "Missing required information",
				variant: "destructive",
			});
			return;
		}

		setSubmitting(true);

		try {
			// Create booking in Firestore
			const bookingData = {
				serviceId: service.id,
				serviceName: service.name,
				providerId: service.providerId,
				providerName: service.providerName,
				businessName: service.businessName,
				clientId: user.uid,
				clientName: user.displayName,
				clientEmail: user.email,
				price: service.price,
				duration: service.duration,
				date: new Date(selectedDate),
				status: "pending",
				address: bookingDetails.address,
				notes: bookingDetails.notes,
				createdAt: serverTimestamp(),
			};

			const bookingRef = await addDoc(collection(db, "bookings"), bookingData);

			// Create payment record (in a real app, this would integrate with a payment processor)
			await addDoc(collection(db, "payments"), {
				bookingId: bookingRef.id,
				serviceId: service.id,
				serviceName: service.name,
				providerId: service.providerId,
				providerName: service.providerName,
				clientId: user.uid,
				amount: service.price,
				status: "pending",
				method: bookingDetails.paymentMethod,
				date: new Date(),
				createdAt: serverTimestamp(),
			});

			toast({
				title: "Booking Confirmed",
				description: "Your booking has been successfully created",
			});

			// Redirect to bookings page
			router.push("/client-dashboard/bookings");
		} catch (error) {
			console.error("Error creating booking:", error);
			toast({
				title: "Error",
				description: "Failed to create booking. Please try again.",
				variant: "destructive",
			});
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p>Loading booking details...</p>
			</div>
		);
	}

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
							className='font-medium transition-colors hover:text-primary'
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
							<Link href='/client-dashboard'>
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
							href={`/services/${serviceId}`}
							className='inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
						>
							<ArrowLeft className='mr-1 h-4 w-4' />
							Back to Service
						</Link>
					</div>

					<div className='grid gap-6 lg:grid-cols-3'>
						<div className='lg:col-span-2'>
							<Card>
								<CardHeader>
									<CardTitle className='text-2xl'>
										Complete Your Booking
									</CardTitle>
									<CardDescription>
										You are booking {service.name} for {selectedDate}
									</CardDescription>
								</CardHeader>
								<form onSubmit={handleSubmitBooking}>
									<CardContent className='space-y-4'>
										<div className='grid gap-4 md:grid-cols-2'>
											<div className='space-y-2'>
												<Label htmlFor='name'>Your Name</Label>
												<Input
													id='name'
													value={user?.displayName || ""}
													disabled
												/>
											</div>
											<div className='space-y-2'>
												<Label htmlFor='email'>Email</Label>
												<Input
													id='email'
													type='email'
													value={user?.email || ""}
													disabled
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='address'>Service Address</Label>
											<Input
												id='address'
												placeholder='Enter the address where the service will be performed'
												value={bookingDetails.address}
												onChange={(e) =>
													setBookingDetails({
														...bookingDetails,
														address: e.target.value,
													})
												}
												required
											/>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='notes'>
												Special Instructions (Optional)
											</Label>
											<Textarea
												id='notes'
												placeholder='Any special instructions or requirements for the service provider'
												value={bookingDetails.notes}
												onChange={(e) =>
													setBookingDetails({
														...bookingDetails,
														notes: e.target.value,
													})
												}
												rows={3}
											/>
										</div>

										<div className='space-y-2'>
											<Label>Payment Method</Label>
											<div className='grid gap-2'>
												<div className='flex items-center space-x-2'>
													<input
														type='radio'
														id='credit_card'
														name='payment_method'
														value='credit_card'
														checked={
															bookingDetails.paymentMethod === "credit_card"
														}
														onChange={() =>
															setBookingDetails({
																...bookingDetails,
																paymentMethod: "credit_card",
															})
														}
														className='h-4 w-4 border-gray-300 text-primary focus:ring-primary'
													/>
													<Label
														htmlFor='credit_card'
														className='font-normal'
													>
														Credit Card
													</Label>
												</div>
												<div className='flex items-center space-x-2'>
													<input
														type='radio'
														id='paypal'
														name='payment_method'
														value='paypal'
														checked={bookingDetails.paymentMethod === "paypal"}
														onChange={() =>
															setBookingDetails({
																...bookingDetails,
																paymentMethod: "paypal",
															})
														}
														className='h-4 w-4 border-gray-300 text-primary focus:ring-primary'
													/>
													<Label
														htmlFor='paypal'
														className='font-normal'
													>
														PayPal
													</Label>
												</div>
											</div>
										</div>
									</CardContent>
									<CardFooter>
										<Button
											type='submit'
											className='w-full'
											disabled={submitting}
										>
											{submitting ? "Processing..." : "Confirm Booking"}
										</Button>
									</CardFooter>
								</form>
							</Card>
						</div>

						<div className='space-y-6'>
							<Card>
								<CardHeader>
									<CardTitle>Booking Summary</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='space-y-1'>
										<h3 className='font-medium'>{service.name}</h3>
										<p className='text-sm text-muted-foreground'>
											{service.description}
										</p>
									</div>

									<div className='space-y-2'>
										<div className='flex items-center gap-2 text-sm'>
											<Calendar className='h-4 w-4 text-muted-foreground' />
											<span>Date: {selectedDate}</span>
										</div>
										<div className='flex items-center gap-2 text-sm'>
											<Clock className='h-4 w-4 text-muted-foreground' />
											<span>Duration: {service.duration} minutes</span>
										</div>
										<div className='flex items-center gap-2 text-sm'>
											<MapPin className='h-4 w-4 text-muted-foreground' />
											<span>
												Provider: {service.businessName || service.providerName}
											</span>
										</div>
									</div>

									<div className='border-t pt-4'>
										<div className='flex justify-between text-sm'>
											<span>Service Price</span>
											<span>${service.price.toFixed(2)}</span>
										</div>
										<div className='flex justify-between text-sm mt-1'>
											<span>Service Fee</span>
											<span>${(service.price * 0.05).toFixed(2)}</span>
										</div>
										<div className='flex justify-between font-medium mt-2 pt-2 border-t'>
											<span>Total</span>
											<span>${(service.price * 1.05).toFixed(2)}</span>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Cancellation Policy</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-sm text-muted-foreground'>
										Free cancellation up to 24 hours before the scheduled
										service. Cancellations within 24 hours may incur a fee of
										50% of the service price.
									</p>
								</CardContent>
							</Card>
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
				</div>
			</footer>
		</div>
	);
}
