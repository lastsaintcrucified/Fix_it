"use client";

import type React from "react";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { createService } from "@/lib/db";

export default function CreateServicePage() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [duration, setDuration] = useState("60");
	const [category, setCategory] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { user, userData } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!user || userData?.role !== "provider") {
			toast({
				title: "Error",
				description: "Only service providers can create services",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);

		try {
			const serviceData = {
				name,
				description,
				price: Number.parseFloat(price),
				duration: Number.parseInt(duration),
				category,
				providerId: user.uid,
				providerName: user.displayName,
				businessName: userData?.businessName,
				status: "active",
			};

			await createService(serviceData);

			toast({
				title: "Service created",
				description: "Your service has been created successfully",
			});

			router.push("/dashboard/services");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "Failed to create service",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='mx-auto max-w-2xl'>
			<div className='flex flex-col gap-2 mb-6'>
				<h1 className='text-3xl font-bold tracking-tight'>
					Create New Service
				</h1>
				<p className='text-muted-foreground'>
					Add a new service to your offerings
				</p>
			</div>

			<Card>
				<form onSubmit={handleSubmit}>
					<CardHeader>
						<CardTitle>Service Details</CardTitle>
						<CardDescription>
							Provide the details of the service you want to offer
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Service Name</Label>
							<Input
								id='name'
								placeholder='e.g. Basic Home Cleaning'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='description'>Description</Label>
							<Textarea
								id='description'
								placeholder='Describe your service in detail'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
								className='min-h-[120px]'
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='price'>Price ($)</Label>
								<Input
									id='price'
									type='number'
									placeholder='99.99'
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									required
									min='0'
									step='0.01'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='duration'>Duration (minutes)</Label>
								<Select
									value={duration}
									onValueChange={setDuration}
								>
									<SelectTrigger id='duration'>
										<SelectValue placeholder='Select duration' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='30'>30 minutes</SelectItem>
										<SelectItem value='60'>1 hour</SelectItem>
										<SelectItem value='90'>1.5 hours</SelectItem>
										<SelectItem value='120'>2 hours</SelectItem>
										<SelectItem value='180'>3 hours</SelectItem>
										<SelectItem value='240'>4 hours</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='category'>Category</Label>
							<Select
								value={category}
								onValueChange={setCategory}
								required
							>
								<SelectTrigger id='category'>
									<SelectValue placeholder='Select a category' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='cleaning'>Cleaning</SelectItem>
									<SelectItem value='plumbing'>Plumbing</SelectItem>
									<SelectItem value='electrical'>Electrical</SelectItem>
									<SelectItem value='gardening'>Gardening</SelectItem>
									<SelectItem value='fitness'>Fitness</SelectItem>
									<SelectItem value='beauty'>Beauty & Spa</SelectItem>
									<SelectItem value='other'>Other</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}
						>
							{isLoading ? "Creating..." : "Create Service"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
