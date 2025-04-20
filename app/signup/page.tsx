"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
	const searchParams = useSearchParams();
	const defaultRole = searchParams.get("role") || "client";
	const [role, setRole] = useState<"client" | "provider">(
		defaultRole as "client" | "provider"
	);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { signup } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);

		try {
			const displayName = `${firstName} ${lastName}`.trim();
			await signup(
				email,
				password,
				displayName,
				role,
				role === "provider" ? businessName : undefined
			);

			toast({
				title: "Account created!",
				description: "You have successfully signed up.",
			});

			// Redirect to dashboard
			router.push("/login");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast({
				title: "Error",
				description:
					error.message || "Failed to create account. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container flex h-screen w-screen flex-col items-center justify-center'>
			<Link
				href='/'
				className='absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2'
			>
				<Shield className='h-6 w-6' />
				<span className='text-lg font-bold'>Fix-it</span>
			</Link>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl'>Create an account</CardTitle>
					<CardDescription>
						Enter your information to create your account
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className='grid gap-4'>
						<RadioGroup
							defaultValue={role}
							className='grid grid-cols-2 gap-4'
							onValueChange={(value) => setRole(value as "client" | "provider")}
						>
							<div>
								<RadioGroupItem
									value='client'
									id='client'
									className='peer sr-only'
								/>
								<Label
									htmlFor='client'
									className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
								>
									<span className='text-sm font-medium'>Client</span>
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value='provider'
									id='provider'
									className='peer sr-only'
								/>
								<Label
									htmlFor='provider'
									className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
								>
									<span className='text-sm font-medium'>Service Provider</span>
								</Label>
							</div>
						</RadioGroup>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='first-name'>First name</Label>
								<Input
									id='first-name'
									placeholder='John'
									value={firstName}
									onChange={(e) => {
										e.preventDefault();
										setFirstName(e.target.value);
									}}
									required
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='last-name'>Last name</Label>
								<Input
									id='last-name'
									placeholder='Doe'
									value={lastName}
									onChange={(e) => {
										e.preventDefault();
										setLastName(e.target.value);
									}}
									required
								/>
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='john.doe@example.com'
								value={email}
								onChange={(e) => {
									e.preventDefault();
									setEmail(e.target.value);
								}}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								value={password}
								onChange={(e) => {
									e.preventDefault();
									setPassword(e.target.value);
								}}
								required
							/>
						</div>
						{role === "provider" && (
							<div className='space-y-2'>
								<Label htmlFor='business-name'>Business name</Label>
								<Input
									id='business-name'
									placeholder='Your Business Name'
									value={businessName}
									onChange={(e) => {
										e.preventDefault();
										setBusinessName(e.target.value);
									}}
									required
								/>
							</div>
						)}
					</CardContent>
					<CardFooter>
						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}
						>
							{isLoading ? "Creating account..." : "Create account"}
						</Button>
					</CardFooter>
				</form>
			</Card>
			<p className='mt-4 text-center text-sm text-muted-foreground'>
				Already have an account?{" "}
				<Link
					href='/login'
					className='underline underline-offset-4 hover:text-primary'
				>
					Log in
				</Link>
			</p>
		</div>
	);
}
