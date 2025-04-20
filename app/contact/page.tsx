"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
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
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Save contact form submission to Firestore
			await addDoc(collection(db, "contactSubmissions"), {
				name,
				email,
				subject,
				message,
				createdAt: serverTimestamp(),
				status: "new",
			});

			toast({
				title: "Message sent",
				description: "Thank you for contacting us. We'll get back to you soon.",
			});

			// Reset form
			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
		} catch (error) {
			console.error("Error submitting contact form:", error);
			toast({
				title: "Error",
				description:
					"There was an error sending your message. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
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
							className='font-medium transition-colors text-primary'
						>
							Contact
						</Link>
					</nav>
					<div className='flex items-center gap-4'>
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
					</div>
				</div>
			</header>

			<main className='flex-1'>
				<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									Contact Us
								</h1>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									We would love to hear from you. Get in touch with our team.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32'>
					<div className='container px-4 md:px-6'>
						<div className='grid gap-6 lg:grid-cols-2 lg:gap-12'>
							<div className='space-y-6'>
								<div>
									<h2 className='text-2xl font-bold tracking-tight'>
										Get in Touch
									</h2>
									<p className='text-muted-foreground mt-2'>
										Have questions about our services? Want to become a service
										provider? Or just want to say hello? We are here to help.
									</p>
								</div>

								<div className='grid gap-4'>
									<div className='flex items-start gap-4'>
										<Mail className='h-6 w-6 text-primary mt-1' />
										<div>
											<h3 className='font-medium'>Email</h3>
											<p className='text-sm text-muted-foreground'>
												support@Fix-it.com
											</p>
										</div>
									</div>
									<div className='flex items-start gap-4'>
										<Phone className='h-6 w-6 text-primary mt-1' />
										<div>
											<h3 className='font-medium'>Phone</h3>
											<p className='text-sm text-muted-foreground'>
												+1 (555) 123-4567
											</p>
										</div>
									</div>
									<div className='flex items-start gap-4'>
										<MapPin className='h-6 w-6 text-primary mt-1' />
										<div>
											<h3 className='font-medium'>Address</h3>
											<p className='text-sm text-muted-foreground'>
												123 Service Street
												<br />
												San Francisco, CA 94103
												<br />
												United States
											</p>
										</div>
									</div>
								</div>

								<div className='rounded-lg border bg-card p-6'>
									<h3 className='text-xl font-bold mb-4'>
										Frequently Asked Questions
									</h3>
									<div className='space-y-4'>
										<div>
											<h4 className='font-medium'>
												How do I sign up as a service provider?
											</h4>
											<p className='text-sm text-muted-foreground mt-1'>
												You can sign up as a service provider by clicking the
												&quot;Become a Provider&quot; button on our homepage or
												by selecting the provider option during the signup
												process.
											</p>
										</div>
										<div>
											<h4 className='font-medium'>How do payments work?</h4>
											<p className='text-sm text-muted-foreground mt-1'>
												We use secure payment processing. Clients pay through
												our platform, and service providers receive payments
												after the service is completed.
											</p>
										</div>
										<div>
											<h4 className='font-medium'>
												What if I need to cancel a booking?
											</h4>
											<p className='text-sm text-muted-foreground mt-1'>
												You can cancel a booking up to 24 hours before the
												scheduled time without any penalty. Cancellations within
												24 hours may incur a fee.
											</p>
										</div>
										<div>
											<h4 className='font-medium'>
												How are service providers verified?
											</h4>
											<p className='text-sm text-muted-foreground mt-1'>
												We verify all service providers through a thorough
												background check, identity verification, and
												professional credential validation process.
											</p>
										</div>
									</div>
								</div>
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Send us a Message</CardTitle>
									<CardDescription>
										Fill out the form below and we will get back to you as soon
										as possible.
									</CardDescription>
								</CardHeader>
								<form onSubmit={handleSubmit}>
									<CardContent className='space-y-4'>
										<div className='space-y-2'>
											<Label htmlFor='name'>Name</Label>
											<Input
												id='name'
												placeholder='Your name'
												value={name}
												onChange={(e) => setName(e.target.value)}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='email'>Email</Label>
											<Input
												id='email'
												type='email'
												placeholder='Your email'
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='subject'>Subject</Label>
											<Input
												id='subject'
												placeholder='Subject of your message'
												value={subject}
												onChange={(e) => setSubject(e.target.value)}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='message'>Message</Label>
											<Textarea
												id='message'
												placeholder='Your message'
												className='min-h-[150px]'
												value={message}
												onChange={(e) => setMessage(e.target.value)}
												required
											/>
										</div>
									</CardContent>
									<CardFooter>
										<Button
											type='submit'
											className='w-full'
											disabled={isLoading}
										>
											{isLoading ? "Sending..." : "Send Message"}
										</Button>
									</CardFooter>
								</form>
							</Card>
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
									Join Our Community
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Connect with us on social media and stay updated with the
									latest news and features.
								</p>
							</div>
							<div className='flex gap-4'>
								<Button
									variant='outline'
									size='icon'
									className='rounded-full'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='h-5 w-5'
									>
										<path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
									</svg>
									<span className='sr-only'>Facebook</span>
								</Button>
								<Button
									variant='outline'
									size='icon'
									className='rounded-full'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='h-5 w-5'
									>
										<path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
									</svg>
									<span className='sr-only'>Twitter</span>
								</Button>
								<Button
									variant='outline'
									size='icon'
									className='rounded-full'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='h-5 w-5'
									>
										<rect
											width='20'
											height='20'
											x='2'
											y='2'
											rx='5'
											ry='5'
										></rect>
										<path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'></path>
										<line
											x1='17.5'
											x2='17.51'
											y1='6.5'
											y2='6.5'
										></line>
									</svg>
									<span className='sr-only'>Instagram</span>
								</Button>
								<Button
									variant='outline'
									size='icon'
									className='rounded-full'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='h-5 w-5'
									>
										<path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
										<rect
											width='4'
											height='12'
											x='2'
											y='9'
										></rect>
										<circle
											cx='4'
											cy='4'
											r='2'
										></circle>
									</svg>
									<span className='sr-only'>LinkedIn</span>
								</Button>
							</div>
						</div>
					</div>
				</section>
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
