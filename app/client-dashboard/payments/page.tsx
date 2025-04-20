"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Download, FileText, Search } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function ClientPaymentsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [timeFilter, setTimeFilter] = useState("all");

	// Sample payments data
	const payments = {
		completed: [
			{
				id: "INV-001",
				service: "Deep Home Cleaning",
				provider: "Smith's Professional Services",
				date: "May 21, 2023",
				amount: 200.0,
				status: "paid",
				method: "Credit Card",
			},
			{
				id: "INV-002",
				service: "Plumbing Repair",
				provider: "Garcia Home Services",
				date: "May 15, 2023",
				amount: 150.0,
				status: "paid",
				method: "PayPal",
			},
			{
				id: "INV-003",
				service: "Haircut and Style",
				provider: "Serenity Spa & Beauty",
				date: "May 5, 2023",
				amount: 60.0,
				status: "paid",
				method: "Credit Card",
			},
			{
				id: "INV-004",
				service: "Personal Training Session",
				provider: "FitLife Personal Training",
				date: "April 28, 2023",
				amount: 80.0,
				status: "refunded",
				method: "Credit Card",
			},
		],
		upcoming: [
			{
				id: "INV-005",
				service: "Lawn Mowing",
				provider: "Green Thumb Gardening",
				date: "Tomorrow",
				amount: 50.0,
				status: "pending",
				dueDate: "Upon completion",
			},
			{
				id: "INV-006",
				service: "Electrical Outlet Installation",
				provider: "Johnson's Electrical Solutions",
				date: "Friday",
				amount: 120.0,
				status: "pending",
				dueDate: "Upon completion",
			},
		],
	};

	// Filter payments based on search term and time filter
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const filterPayments = (paymentList: any[]) => {
		let filtered = paymentList;

		// Apply search filter
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(payment) =>
					payment.service.toLowerCase().includes(term) ||
					payment.provider.toLowerCase().includes(term) ||
					payment.id.toLowerCase().includes(term)
			);
		}

		// Apply time filter
		if (timeFilter !== "all") {
			const now = new Date();
			const threeMonthsAgo = new Date();
			threeMonthsAgo.setMonth(now.getMonth() - 3);
			const sixMonthsAgo = new Date();
			sixMonthsAgo.setMonth(now.getMonth() - 6);

			filtered = filtered.filter((payment) => {
				const paymentDate = new Date(payment.date);

				switch (timeFilter) {
					case "3months":
						return paymentDate >= threeMonthsAgo;
					case "6months":
						return paymentDate >= sixMonthsAgo;
					default:
						return true;
				}
			});
		}

		return filtered;
	};

	// Get status badge variant
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "paid":
				return "default";
			case "pending":
				return "secondary";
			case "refunded":
				return "destructive";
			default:
				return "outline";
		}
	};

	// Calculate totals
	const completedPayments = filterPayments(payments.completed);
	const totalSpent = completedPayments
		.filter((payment) => payment.status === "paid")
		.reduce((sum, payment) => sum + payment.amount, 0);

	const upcomingTotal = filterPayments(payments.upcoming).reduce(
		(sum, payment) => sum + payment.amount,
		0
	);

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Payment History</h1>
					<p className='text-muted-foreground'>View and manage your payments</p>
				</div>
				<div className='flex items-center gap-2'>
					<div className='relative w-full md:w-auto'>
						<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Search payments...'
							className='w-full pl-8 md:w-[200px] lg:w-[300px]'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Select
						value={timeFilter}
						onValueChange={setTimeFilter}
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Time period' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All time</SelectItem>
							<SelectItem value='3months'>Last 3 months</SelectItem>
							<SelectItem value='6months'>Last 6 months</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Spent</CardTitle>
						<CreditCard className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>${totalSpent.toFixed(2)}</div>
						<p className='text-xs text-muted-foreground'>
							Across {completedPayments.length} payments
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Upcoming Payments
						</CardTitle>
						<Calendar className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							${upcomingTotal.toFixed(2)}
						</div>
						<p className='text-xs text-muted-foreground'>
							{payments.upcoming.length} pending payments
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs
				defaultValue='completed'
				className='w-full'
			>
				<TabsList>
					<TabsTrigger value='completed'>Completed Payments</TabsTrigger>
					<TabsTrigger value='upcoming'>Upcoming Payments</TabsTrigger>
				</TabsList>

				<TabsContent
					value='completed'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Payment History</CardTitle>
							<CardDescription>
								View your past payments for services
							</CardDescription>
						</CardHeader>
						<CardContent>
							{completedPayments.length === 0 ? (
								<div className='flex flex-col items-center justify-center py-10 text-center'>
									<CreditCard className='h-10 w-10 text-muted-foreground mb-4' />
									{searchTerm || timeFilter !== "all" ? (
										<>
											<p className='mb-2 text-lg font-medium'>
												No matching payments found
											</p>
											<p className='text-muted-foreground'>
												Try adjusting your search or filters
											</p>
										</>
									) : (
										<>
											<p className='mb-2 text-lg font-medium'>
												No payment history
											</p>
											<p className='text-muted-foreground'>
												You have not made any payments yet
											</p>
										</>
									)}
								</div>
							) : (
								<div className='rounded-md border'>
									<div className='grid grid-cols-5 gap-4 p-4 font-medium border-b'>
										<div>Invoice</div>
										<div className='col-span-2'>Service</div>
										<div>Date</div>
										<div className='text-right'>Amount</div>
									</div>
									<div className='divide-y'>
										{completedPayments.map((payment) => (
											<div
												key={payment.id}
												className='grid grid-cols-5 gap-4 p-4 items-center'
											>
												<div className='font-medium'>{payment.id}</div>
												<div className='col-span-2'>
													<div>{payment.service}</div>
													<div className='text-sm text-muted-foreground'>
														{payment.provider}
													</div>
												</div>
												<div className='flex flex-col'>
													<div>{payment.date}</div>
													<Badge
														variant={getStatusBadge(payment.status)}
														className='w-fit mt-1 capitalize'
													>
														{payment.status}
													</Badge>
												</div>
												<div className='flex items-center justify-end gap-2'>
													<span className='font-medium'>
														${payment.amount.toFixed(2)}
													</span>
													<Button
														variant='ghost'
														size='icon'
														title='Download invoice'
													>
														<Download className='h-4 w-4' />
														<span className='sr-only'>Download invoice</span>
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value='upcoming'
					className='space-y-4'
				>
					<Card>
						<CardHeader>
							<CardTitle>Upcoming Payments</CardTitle>
							<CardDescription>Payments for scheduled services</CardDescription>
						</CardHeader>
						<CardContent>
							{filterPayments(payments.upcoming).length === 0 ? (
								<div className='flex flex-col items-center justify-center py-10 text-center'>
									<Calendar className='h-10 w-10 text-muted-foreground mb-4' />
									{searchTerm ? (
										<>
											<p className='mb-2 text-lg font-medium'>
												No matching upcoming payments
											</p>
											<p className='text-muted-foreground'>
												Try adjusting your search
											</p>
										</>
									) : (
										<>
											<p className='mb-2 text-lg font-medium'>
												No upcoming payments
											</p>
											<p className='text-muted-foreground'>
												You do not have any pending payments
											</p>
										</>
									)}
								</div>
							) : (
								<div className='space-y-4'>
									{filterPayments(payments.upcoming).map((payment) => (
										<Card key={payment.id}>
											<CardContent className='p-6'>
												<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
													<div className='space-y-1'>
														<div className='flex items-center gap-2'>
															<h3 className='font-semibold text-lg'>
																{payment.service}
															</h3>
															<Badge variant='secondary'>Pending</Badge>
														</div>
														<p className='text-muted-foreground'>
															{payment.provider}
														</p>
													</div>
													<div className='flex flex-col gap-1 md:items-end'>
														<p className='font-medium text-lg'>
															${payment.amount.toFixed(2)}
														</p>
														<p className='text-sm text-muted-foreground'>
															Due: {payment.dueDate}
														</p>
													</div>
												</div>

												<div className='mt-4 flex items-center justify-between'>
													<div className='flex items-center gap-2 text-sm text-muted-foreground'>
														<Calendar className='h-4 w-4' />
														<span>Service date: {payment.date}</span>
													</div>
													<div className='flex gap-2'>
														<Button
															variant='outline'
															size='sm'
														>
															<FileText className='h-4 w-4 mr-2' />
															View Details
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
