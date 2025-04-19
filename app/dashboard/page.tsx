import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CalendarClock,
	CreditCard,
	DollarSign,
	Star,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
				<p className='text-muted-foreground'>
					Welcome back, John! Here is an overview of your business.
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
						<DollarSign className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>$4,231.89</div>
						<p className='text-xs text-muted-foreground'>
							+20.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Bookings</CardTitle>
						<CalendarClock className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>+48</div>
						<p className='text-xs text-muted-foreground'>
							+12% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Active Clients
						</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>24</div>
						<p className='text-xs text-muted-foreground'>
							+4 new clients this month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Average Rating
						</CardTitle>
						<Star className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>4.8</div>
						<p className='text-xs text-muted-foreground'>Based on 36 reviews</p>
					</CardContent>
				</Card>
			</div>

			<Tabs
				defaultValue='upcoming'
				className='w-full'
			>
				<TabsList>
					<TabsTrigger value='upcoming'>Upcoming Bookings</TabsTrigger>
					<TabsTrigger value='recent'>Recent Payments</TabsTrigger>
				</TabsList>
				<TabsContent
					value='upcoming'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Upcoming Bookings</CardTitle>
							<CardDescription>
								You have 6 upcoming bookings for this week
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{[
								{
									id: 1,
									client: "Sarah Johnson",
									service: "Home Cleaning",
									date: "Today, 2:00 PM",
									status: "confirmed",
								},
								{
									id: 2,
									client: "Michael Brown",
									service: "Plumbing Repair",
									date: "Tomorrow, 10:00 AM",
									status: "confirmed",
								},
								{
									id: 3,
									client: "Emily Davis",
									service: "Home Cleaning",
									date: "Wed, 1:30 PM",
									status: "pending",
								},
								{
									id: 4,
									client: "Robert Wilson",
									service: "Electrical Work",
									date: "Thu, 9:00 AM",
									status: "confirmed",
								},
							].map((booking) => (
								<div
									key={booking.id}
									className='flex items-center justify-between rounded-lg border p-4'
								>
									<div className='flex items-center gap-4'>
										<Avatar>
											<AvatarFallback>
												{booking.client
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-medium'>{booking.client}</p>
											<p className='text-sm text-muted-foreground'>
												{booking.service}
											</p>
										</div>
									</div>
									<div className='flex items-center gap-4'>
										<div className='text-right'>
											<p className='text-sm font-medium'>{booking.date}</p>
											<Badge
												variant={
													booking.status === "confirmed" ? "default" : "outline"
												}
											>
												{booking.status}
											</Badge>
										</div>
										<Button
											variant='ghost'
											size='icon'
										>
											<CalendarClock className='h-4 w-4' />
											<span className='sr-only'>View booking</span>
										</Button>
									</div>
								</div>
							))}
							<Button
								variant='outline'
								className='w-full'
							>
								View all bookings
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent
					value='recent'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Recent Payments</CardTitle>
							<CardDescription>
								You received 8 payments in the last 30 days
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{[
								{
									id: 1,
									client: "Sarah Johnson",
									service: "Home Cleaning",
									amount: "$120.00",
									date: "Today",
								},
								{
									id: 2,
									client: "Michael Brown",
									service: "Plumbing Repair",
									amount: "$85.50",
									date: "Yesterday",
								},
								{
									id: 3,
									client: "Emily Davis",
									service: "Home Cleaning",
									amount: "$120.00",
									date: "3 days ago",
								},
								{
									id: 4,
									client: "Robert Wilson",
									service: "Electrical Work",
									amount: "$150.00",
									date: "5 days ago",
								},
							].map((payment) => (
								<div
									key={payment.id}
									className='flex items-center justify-between rounded-lg border p-4'
								>
									<div className='flex items-center gap-4'>
										<Avatar>
											<AvatarFallback>
												{payment.client
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-medium'>{payment.client}</p>
											<p className='text-sm text-muted-foreground'>
												{payment.service}
											</p>
										</div>
									</div>
									<div className='flex items-center gap-4'>
										<div className='text-right'>
											<p className='text-sm font-medium'>{payment.amount}</p>
											<p className='text-xs text-muted-foreground'>
												{payment.date}
											</p>
										</div>
										<Button
											variant='ghost'
											size='icon'
										>
											<CreditCard className='h-4 w-4' />
											<span className='sr-only'>View payment</span>
										</Button>
									</div>
								</div>
							))}
							<Button
								variant='outline'
								className='w-full'
							>
								View all payments
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
