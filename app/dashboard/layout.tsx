"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	Bell,
	Calendar,
	CreditCard,
	Home,
	LogOut,
	MessageSquare,
	Settings,
	Shield,
	Star,
	User,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { Toaster } from "@/components/toaster";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const { user, loading, logout } = useAuth();
	const router = useRouter();

	// Protect dashboard routes
	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	// Show loading or nothing if not authenticated
	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				Loading...
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const handleLogout = async () => {
		try {
			await logout();
			router.push("/");
		} catch (error) {
			console.error("Error logging out:", error);
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
					<div className='flex items-center gap-4'>
						<Button
							variant='ghost'
							size='icon'
							className='relative'
						>
							<Bell className='h-5 w-5' />
							<span className='absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary'></span>
							<span className='sr-only'>Notifications</span>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									className='relative h-8 w-8 rounded-full'
								>
									<Avatar className='h-8 w-8'>
										<AvatarImage
											src='/placeholder-user.jpg'
											alt='User'
										/>
										<AvatarFallback>
											{user.displayName?.charAt(0) || "U"}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className='w-56'
								align='end'
								forceMount
							>
								<DropdownMenuLabel className='font-normal'>
									<div className='flex flex-col space-y-1'>
										<p className='text-sm font-medium leading-none'>
											{user.displayName || "User"}
										</p>
										<p className='text-xs leading-none text-muted-foreground'>
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<User className='mr-2 h-4 w-4' />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href='/dashboard/settings'>
										<Settings className='mr-2 h-4 w-4' />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<LogOut className='mr-2 h-4 w-4' />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>
			<div className='flex flex-1'>
				<aside className='hidden w-64 flex-col border-r bg-muted/40 md:flex'>
					<div className='flex flex-col gap-2 p-4'>
						<nav className='grid gap-1'>
							<Link href='/dashboard'>
								<Button
									variant='ghost'
									className='w-full justify-start'
								>
									<Home className='mr-2 h-4 w-4' />
									Dashboard
								</Button>
							</Link>
							<Link href='/dashboard/services'>
								<Button
									variant='ghost'
									className='w-full justify-start'
								>
									<Users className='mr-2 h-4 w-4' />
									Services
								</Button>
							</Link>
							<Link href='/dashboard/bookings'>
								<Button
									variant='ghost'
									className='w-full justify-start'
								>
									<Calendar className='mr-2 h-4 w-4' />
									Bookings
								</Button>
							</Link>
							<Link href='/dashboard/messages'>
								<Button
									variant='ghost'
									className='w-full justify-start'
								>
									<MessageSquare className='mr-2 h-4 w-4' />
									Messages
								</Button>
							</Link>
							<Link href='/dashboard/payments'>
								<Button
									variant='ghost'
									className='w-full justify-start'
								>
									<CreditCard className='mr-2 h-4 w-4' />
									Payments
								</Button>
							</Link>
							<Link href='/dashboard/reviews'>
								<Button
									variant='ghost'
									className='w-full justify-start'
								>
									<Star className='mr-2 h-4 w-4' />
									Reviews
								</Button>
							</Link>
						</nav>
					</div>
				</aside>
				<main className='flex-1 overflow-auto p-4 md:p-6'>{children}</main>
			</div>
			<Toaster />
		</div>
	);
}
