import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Users, Calendar, CreditCard } from "lucide-react";

export default function AboutPage() {
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
							className='font-medium transition-colors text-primary'
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
						<div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
							<div className='flex flex-col justify-center space-y-4'>
								<div className='space-y-2'>
									<h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
										About Fix-it
									</h1>
									<p className='max-w-[600px] text-muted-foreground md:text-xl'>
										Connecting clients with trusted service providers since 2023
									</p>
								</div>
								<p className='max-w-[600px] text-muted-foreground'>
									Fix-it is a platform that connects clients with trusted
									service providers in their area. Our mission is to make it
									easy for people to find and book quality services, while
									helping service providers grow their business.
								</p>
							</div>
							<div className='mx-auto w-full max-w-[500px] aspect-video rounded-xl bg-muted/50 p-2 shadow-lg'>
								<div className='h-full w-full rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-muted flex items-center justify-center'>
									<Shield className='h-24 w-24 text-primary/70' />
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
									Our Mission
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									We are on a mission to transform how services are discovered,
									booked, and delivered
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12'>
							<Card className='p-6'>
								<CardContent className='p-0 space-y-4'>
									<h3 className='text-xl font-bold'>For Clients</h3>
									<p className='text-muted-foreground'>
										We make it easy to find and book trusted service providers
										in your area. Our platform offers transparent pricing,
										verified reviews, and a seamless booking experience.
									</p>
									<ul className='space-y-2'>
										<li className='flex items-center gap-2'>
											<CheckCircle className='h-5 w-5 text-primary' />
											<span>Find trusted providers in your area</span>
										</li>
										<li className='flex items-center gap-2'>
											<CheckCircle className='h-5 w-5 text-primary' />
											<span>Book services with real-time availability</span>
										</li>
										<li className='flex items-center gap-2'>
											<CheckCircle className='h-5 w-5 text-primary' />
											<span>Pay securely through our platform</span>
										</li>
										<li className='flex items-center gap-2'>
											<CheckCircle className='h-5 w-5 text-primary' />
											<span>Leave reviews and build community trust</span>
										</li>
									</ul>
								</CardContent>
							</Card>
							<Card className='p-6'>
								<CardContent className='p-0 space-y-4'>
									<h3 className='text-xl font-bold'>For Service Providers</h3>
									<p className='text-muted-foreground'>
										We help service providers grow their business by connecting
										them with clients looking for their services. Our platform
										offers tools to manage bookings, payments, and client
										relationships.
									</p>
									<ul className='space-y-2'>
										<li className='flex items-center gap-2'>
											<CheckCircle className='h-5 w-5 text-primary' />
											<span>Reach more clients in your area</span>
										</li>
										<li className='flex items-center gap-2'>
											<CheckCircle className='h-5 w-5 text-primary' />
											<span>Manage your schedule and bookings</span>
										</li>
										<li className='flex items-center gap-2'>
											<CheckCircle className='h-5 w-5 text-primary' />
											<span>Get paid securely and on time</span>
										</li>
										<li className='flex items-center gap-2'>
											<CheckCircle className='h-5 w-5 text-primary' />
											<span>Build your reputation with verified reviews</span>
										</li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
									How It Works
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Our platform makes it easy to connect clients with service
									providers
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3'>
							<div className='flex flex-col items-center space-y-4 text-center'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<Users className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-bold'>1. Find Services</h3>
								<p className='text-muted-foreground'>
									Browse through our extensive list of verified service
									providers in your area
								</p>
							</div>
							<div className='flex flex-col items-center space-y-4 text-center'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<Calendar className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-bold'>2. Book Appointments</h3>
								<p className='text-muted-foreground'>
									Schedule appointments at your convenience with real-time
									availability
								</p>
							</div>
							<div className='flex flex-col items-center space-y-4 text-center'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<CreditCard className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-bold'>3. Pay Securely</h3>
								<p className='text-muted-foreground'>
									Pay for services securely through our platform with multiple
									payment options
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
									Our Team
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Meet the people behind Fix-it
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
							{[
								{
									name: "Sarah Johnson",
									role: "CEO & Founder",
									bio: "10+ years experience in tech and service industries",
								},
								{
									name: "Michael Chen",
									role: "CTO",
									bio: "Former senior engineer at major tech companies",
								},
								{
									name: "Jessica Williams",
									role: "Head of Operations",
									bio: "Expert in scaling marketplace businesses",
								},
								{
									name: "David Rodriguez",
									role: "Head of Product",
									bio: "Passionate about creating intuitive user experiences",
								},
								{
									name: "Emily Taylor",
									role: "Customer Success Lead",
									bio: "Dedicated to ensuring client and provider satisfaction",
								},
								{
									name: "James Wilson",
									role: "Marketing Director",
									bio: "Specialist in growth marketing for startups",
								},
							].map((member) => (
								<Card
									key={member.name}
									className='overflow-hidden'
								>
									<CardContent className='p-6'>
										<div className='flex flex-col items-center text-center space-y-4'>
											<div className='h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl'>
												{member.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</div>
											<div>
												<h3 className='text-xl font-bold'>{member.name}</h3>
												<p className='text-sm text-muted-foreground'>
													{member.role}
												</p>
											</div>
											<p className='text-sm text-muted-foreground'>
												{member.bio}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
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
									Be part of the Fix-it community today
								</p>
							</div>
							<div className='flex flex-col gap-2 min-[400px]:flex-row'>
								<Link href='/signup?role=client'>
									<Button
										size='lg'
										className='w-full'
									>
										Sign Up as Client
									</Button>
								</Link>
								<Link href='/signup?role=provider'>
									<Button
										size='lg'
										variant='outline'
										className='w-full'
									>
										Become a Provider
									</Button>
								</Link>
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
