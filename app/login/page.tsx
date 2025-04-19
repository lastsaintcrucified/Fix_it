"use client";

import type React from "react";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);

		try {
			await login(email, password);

			toast({
				title: "Logged in",
				description: "You have successfully logged in.",
			});

			// Redirect to dashboard
			router.push("/dashboard");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast({
				title: "Error",
				description:
					error.message || "Failed to log in. Please check your credentials.",
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
				<span className='text-lg font-bold'>ServiceHub</span>
			</Link>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl'>Log in</CardTitle>
					<CardDescription>
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className='grid gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='john.doe@example.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className='grid gap-2 mb-4'>
							<div className='flex items-center justify-between'>
								<Label htmlFor='password'>Password</Label>
								<Link
									href='/forgot-password'
									className='text-sm text-muted-foreground hover:text-primary'
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id='password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter className='flex flex-col'>
						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}
						>
							{isLoading ? "Logging in..." : "Log in"}
						</Button>
						<div className='mt-4 text-center text-sm'>
							Don&apos;t have an account?{" "}
							<Link
								href='/signup'
								className='underline underline-offset-4 hover:text-primary'
							>
								Sign up
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
