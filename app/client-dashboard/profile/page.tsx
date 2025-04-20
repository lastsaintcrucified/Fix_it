"use client";

import type React from "react";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function ClientProfilePage() {
	const { user } = useAuth();
	const { toast } = useToast();

	// Sample user profile data
	const [profile, setProfile] = useState({
		firstName: "Emma",
		lastName: "Thompson",
		email: user?.email || "emma.thompson@example.com",
		phone: "+1 (555) 123-4567",
		address: "123 Home Street, Apt 4B",
		city: "San Francisco",
		state: "CA",
		zipCode: "94103",
		bio: "I'm a busy professional looking for reliable service providers to help maintain my home and lifestyle.",
	});

	// Password change state
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	// Handle profile update
	const handleProfileUpdate = (e: React.FormEvent) => {
		e.preventDefault();

		// In a real app, you would update the profile in the database
		toast({
			title: "Profile updated",
			description: "Your profile information has been updated successfully.",
		});
	};

	// Handle password change
	const handlePasswordChange = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate passwords
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast({
				title: "Passwords don't match",
				description: "New password and confirmation password must match.",
				variant: "destructive",
			});
			return;
		}

		// In a real app, you would update the password in the database
		toast({
			title: "Password changed",
			description: "Your password has been changed successfully.",
		});

		// Reset form
		setPasswordData({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	};

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>My Profile</h1>
				<p className='text-muted-foreground'>
					Manage your personal information and account settings
				</p>
			</div>

			<div className='grid gap-6 md:grid-cols-5'>
				<Card className='md:col-span-2'>
					<CardHeader>
						<CardTitle>Profile Information</CardTitle>
						<CardDescription>
							View and update your profile details
						</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-col items-center space-y-4'>
						<Avatar className='h-24 w-24'>
							<AvatarImage
								src='/placeholder-user.jpg'
								alt='Profile'
							/>
							<AvatarFallback>
								{profile.firstName.charAt(0) + profile.lastName.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className='text-center'>
							<h3 className='text-lg font-medium'>
								{profile.firstName} {profile.lastName}
							</h3>
							<p className='text-sm text-muted-foreground'>{profile.email}</p>
						</div>
						<div className='w-full space-y-2'>
							<div className='flex justify-between text-sm'>
								<span className='text-muted-foreground'>Member since:</span>
								<span>January 2023</span>
							</div>
							<div className='flex justify-between text-sm'>
								<span className='text-muted-foreground'>Services booked:</span>
								<span>12</span>
							</div>
							<div className='flex justify-between text-sm'>
								<span className='text-muted-foreground'>Reviews given:</span>
								<span>8</span>
							</div>
						</div>
						<Button
							variant='outline'
							className='w-full'
						>
							Change Profile Picture
						</Button>
					</CardContent>
				</Card>

				<Card className='md:col-span-3'>
					<CardHeader>
						<CardTitle>Account Settings</CardTitle>
						<CardDescription>Manage your account preferences</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs
							defaultValue='personal'
							className='w-full'
						>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger value='personal'>Personal Info</TabsTrigger>
								<TabsTrigger value='security'>Security</TabsTrigger>
							</TabsList>

							<TabsContent
								value='personal'
								className='space-y-4 pt-4'
							>
								<form onSubmit={handleProfileUpdate}>
									<div className='grid gap-4 md:grid-cols-2'>
										<div className='space-y-2'>
											<Label htmlFor='firstName'>First Name</Label>
											<Input
												id='firstName'
												value={profile.firstName}
												onChange={(e) =>
													setProfile({ ...profile, firstName: e.target.value })
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='lastName'>Last Name</Label>
											<Input
												id='lastName'
												value={profile.lastName}
												onChange={(e) =>
													setProfile({ ...profile, lastName: e.target.value })
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='email'>Email</Label>
											<Input
												id='email'
												type='email'
												value={profile.email}
												onChange={(e) =>
													setProfile({ ...profile, email: e.target.value })
												}
												disabled
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='phone'>Phone Number</Label>
											<Input
												id='phone'
												value={profile.phone}
												onChange={(e) =>
													setProfile({ ...profile, phone: e.target.value })
												}
											/>
										</div>
										<div className='space-y-2 md:col-span-2'>
											<Label htmlFor='address'>Address</Label>
											<Input
												id='address'
												value={profile.address}
												onChange={(e) =>
													setProfile({ ...profile, address: e.target.value })
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='city'>City</Label>
											<Input
												id='city'
												value={profile.city}
												onChange={(e) =>
													setProfile({ ...profile, city: e.target.value })
												}
											/>
										</div>
										<div className='grid grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label htmlFor='state'>State</Label>
												<Input
													id='state'
													value={profile.state}
													onChange={(e) =>
														setProfile({ ...profile, state: e.target.value })
													}
												/>
											</div>
											<div className='space-y-2'>
												<Label htmlFor='zipCode'>ZIP Code</Label>
												<Input
													id='zipCode'
													value={profile.zipCode}
													onChange={(e) =>
														setProfile({ ...profile, zipCode: e.target.value })
													}
												/>
											</div>
										</div>
										<div className='space-y-2 md:col-span-2'>
											<Label htmlFor='bio'>Bio</Label>
											<Textarea
												id='bio'
												value={profile.bio}
												onChange={(e) =>
													setProfile({ ...profile, bio: e.target.value })
												}
												rows={3}
											/>
										</div>
									</div>
									<div className='mt-6 flex justify-end'>
										<Button type='submit'>Save Changes</Button>
									</div>
								</form>
							</TabsContent>

							<TabsContent
								value='security'
								className='space-y-4 pt-4'
							>
								<form onSubmit={handlePasswordChange}>
									<div className='space-y-4'>
										<div className='space-y-2'>
											<Label htmlFor='currentPassword'>Current Password</Label>
											<Input
												id='currentPassword'
												type='password'
												value={passwordData.currentPassword}
												onChange={(e) =>
													setPasswordData({
														...passwordData,
														currentPassword: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='newPassword'>New Password</Label>
											<Input
												id='newPassword'
												type='password'
												value={passwordData.newPassword}
												onChange={(e) =>
													setPasswordData({
														...passwordData,
														newPassword: e.target.value,
													})
												}
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='confirmPassword'>
												Confirm New Password
											</Label>
											<Input
												id='confirmPassword'
												type='password'
												value={passwordData.confirmPassword}
												onChange={(e) =>
													setPasswordData({
														...passwordData,
														confirmPassword: e.target.value,
													})
												}
											/>
										</div>
									</div>
									<div className='mt-6 flex justify-end'>
										<Button type='submit'>Change Password</Button>
									</div>
								</form>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Notification Preferences</CardTitle>
					<CardDescription>
						Manage how you receive notifications
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-6 md:grid-cols-2'>
						<div className='flex items-center justify-between'>
							<div>
								<h4 className='font-medium'>Email Notifications</h4>
								<p className='text-sm text-muted-foreground'>
									Receive booking confirmations and updates
								</p>
							</div>
							<div className='flex items-center space-x-2'>
								<Label
									htmlFor='email-notifications'
									className='sr-only'
								>
									Email Notifications
								</Label>
								<input
									type='checkbox'
									id='email-notifications'
									className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
									defaultChecked
								/>
							</div>
						</div>
						<div className='flex items-center justify-between'>
							<div>
								<h4 className='font-medium'>SMS Notifications</h4>
								<p className='text-sm text-muted-foreground'>
									Receive text messages for booking reminders
								</p>
							</div>
							<div className='flex items-center space-x-2'>
								<Label
									htmlFor='sms-notifications'
									className='sr-only'
								>
									SMS Notifications
								</Label>
								<input
									type='checkbox'
									id='sms-notifications'
									className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
									defaultChecked
								/>
							</div>
						</div>
						<div className='flex items-center justify-between'>
							<div>
								<h4 className='font-medium'>Marketing Emails</h4>
								<p className='text-sm text-muted-foreground'>
									Receive promotional offers and updates
								</p>
							</div>
							<div className='flex items-center space-x-2'>
								<Label
									htmlFor='marketing-emails'
									className='sr-only'
								>
									Marketing Emails
								</Label>
								<input
									type='checkbox'
									id='marketing-emails'
									className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
								/>
							</div>
						</div>
						<div className='flex items-center justify-between'>
							<div>
								<h4 className='font-medium'>Service Provider Updates</h4>
								<p className='text-sm text-muted-foreground'>
									Receive updates from your favorite providers
								</p>
							</div>
							<div className='flex items-center space-x-2'>
								<Label
									htmlFor='provider-updates'
									className='sr-only'
								>
									Service Provider Updates
								</Label>
								<input
									type='checkbox'
									id='provider-updates'
									className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
									defaultChecked
								/>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex justify-end'>
					<Button>Save Preferences</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
