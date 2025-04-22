import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle, Clock, Shield, Star } from "lucide-react";

export default function Home() {
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
				<section className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted'>
					<div className='container px-4 md:px-6'>
						<div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
							<div className='flex flex-col justify-center space-y-4'>
								<div className='space-y-2'>
									<h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
										Find and Book Professional Services
									</h1>
									<p className='max-w-[600px] text-muted-foreground md:text-xl'>
										Connect with trusted service providers in your area. Book
										appointments, manage payments, and leave reviews all in one
										place.
									</p>
								</div>
								<div className='flex flex-col gap-2 min-[400px]:flex-row'>
									<Link href='/signup?role=client'>
										<Button
											size='lg'
											className='w-full'
										>
											Book a Service
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
							<div className='mx-auto w-full max-w-[500px] aspect-video rounded-xl bg-muted/50 p-2 shadow-lg'>
								<div className='h-full w-full rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-muted flex items-center justify-center'>
									<CalendarClock className='h-24 w-24 text-primary/70' />
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									How It Works
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Our platform makes it easy to find, book, and manage services
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12'>
							<div className='flex flex-col items-center space-y-4 text-center'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<Search className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-bold'>Search Services</h3>
								<p className='text-muted-foreground'>
									Browse through our extensive list of verified service
									providers in your area
								</p>
							</div>
							<div className='flex flex-col items-center space-y-4 text-center'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<CalendarClock className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-bold'>Book Appointments</h3>
								<p className='text-muted-foreground'>
									Schedule appointments at your convenience with real-time
									availability
								</p>
							</div>
							<div className='flex flex-col items-center space-y-4 text-center'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
									<Star className='h-8 w-8 text-primary' />
								</div>
								<h3 className='text-xl font-bold'>Review & Pay</h3>
								<p className='text-muted-foreground'>
									Securely pay for services and leave reviews to help others
									find great providers
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									Popular Services
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Discover top-rated service providers in these popular
									categories
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
							{[
								{ name: "Home Cleaning", icon: "🧹", bookings: 1240 },
								{ name: "Plumbing", icon: "🔧", bookings: 890 },
								{ name: "Electrical", icon: "⚡", bookings: 760 },
								{ name: "Gardening", icon: "🌱", bookings: 650 },
								{ name: "Personal Training", icon: "💪", bookings: 520 },
								{ name: "Beauty & Spa", icon: "💅", bookings: 480 },
							].map((service) => (
								<div
									key={service.name}
									className='group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md'
								>
									<div className='flex flex-col space-y-2'>
										<div className='text-4xl'>{service.icon}</div>
										<h3 className='text-xl font-bold'>{service.name}</h3>
										<p className='text-sm text-muted-foreground flex items-center gap-1'>
											<Clock className='h-4 w-4' />
											{service.bookings}+ bookings
										</p>
									</div>
									<Link
										href='/services'
										className='absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
									/>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									Why Choose Fix-it
								</h2>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									We are committed to providing the best experience for both
									clients and service providers
								</p>
							</div>
						</div>
						<div className='mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2'>
							<div className='flex flex-col space-y-2'>
								<CheckCircle className='h-6 w-6 text-primary' />
								<h3 className='text-xl font-bold'>Verified Providers</h3>
								<p className='text-muted-foreground'>
									All service providers undergo a thorough verification process
								</p>
							</div>
							<div className='flex flex-col space-y-2'>
								<CheckCircle className='h-6 w-6 text-primary' />
								<h3 className='text-xl font-bold'>Secure Payments</h3>
								<p className='text-muted-foreground'>
									Your transactions are protected with industry-standard
									security
								</p>
							</div>
							<div className='flex flex-col space-y-2'>
								<CheckCircle className='h-6 w-6 text-primary' />
								<h3 className='text-xl font-bold'>Real-time Booking</h3>
								<p className='text-muted-foreground'>
									Book services instantly with real-time availability
								</p>
							</div>
							<div className='flex flex-col space-y-2'>
								<CheckCircle className='h-6 w-6 text-primary' />
								<h3 className='text-xl font-bold'>Customer Support</h3>
								<p className='text-muted-foreground'>
									Our team is available to assist you with any questions or
									issues
								</p>
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

function Search(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<circle
				cx='11'
				cy='11'
				r='8'
			/>
			<path d='m21 21-4.3-4.3' />
		</svg>
	);
}
