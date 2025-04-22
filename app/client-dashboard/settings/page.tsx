"use client";

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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
	Bell,
	Lock,
	Eye,
	Moon,
	Sun,
	Smartphone,
	Mail,
	Globe,
} from "lucide-react";

export default function ClientSettingsPage() {
	const { toast } = useToast();

	// Notification settings
	const [notificationSettings, setNotificationSettings] = useState({
		emailNotifications: true,
		smsNotifications: true,
		pushNotifications: true,
		marketingEmails: false,
		bookingReminders: true,
		serviceUpdates: true,
		paymentNotifications: true,
	});

	// Privacy settings
	const [privacySettings, setPrivacySettings] = useState({
		profileVisibility: "public",
		shareBookingHistory: false,
		shareReviews: true,
		allowLocationAccess: true,
	});

	// Appearance settings
	const [appearanceSettings, setAppearanceSettings] = useState({
		theme: "system",
		fontSize: "medium",
		reducedMotion: false,
		highContrast: false,
	});

	// Security settings
	const [securitySettings, setSecuritySettings] = useState({
		twoFactorAuth: false,
		loginNotifications: true,
		sessionTimeout: "30",
	});

	// Handle save settings
	const handleSaveSettings = (section: string) => {
		toast({
			title: "Settings saved",
			description: `Your ${section} settings have been updated successfully.`,
		});
	};

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
				<p className='text-muted-foreground'>
					Manage your account settings and preferences
				</p>
			</div>

			<Tabs
				defaultValue='notifications'
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='notifications'>Notifications</TabsTrigger>
					<TabsTrigger value='privacy'>Privacy</TabsTrigger>
					<TabsTrigger value='appearance'>Appearance</TabsTrigger>
					<TabsTrigger value='security'>Security</TabsTrigger>
				</TabsList>

				{/* Notifications Tab */}
				<TabsContent
					value='notifications'
					className='space-y-4 pt-4'
				>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Bell className='h-5 w-5' />
								Notification Preferences
							</CardTitle>
							<CardDescription>
								Control how and when you receive notifications
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Communication Channels</h3>
								<div className='grid gap-4'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Mail className='h-4 w-4 text-muted-foreground' />
											<div>
												<Label htmlFor='email-notifications'>
													Email Notifications
												</Label>
												<p className='text-sm text-muted-foreground'>
													Receive notifications via email
												</p>
											</div>
										</div>
										<Switch
											id='email-notifications'
											checked={notificationSettings.emailNotifications}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													emailNotifications: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Smartphone className='h-4 w-4 text-muted-foreground' />
											<div>
												<Label htmlFor='sms-notifications'>
													SMS Notifications
												</Label>
												<p className='text-sm text-muted-foreground'>
													Receive notifications via text message
												</p>
											</div>
										</div>
										<Switch
											id='sms-notifications'
											checked={notificationSettings.smsNotifications}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													smsNotifications: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Bell className='h-4 w-4 text-muted-foreground' />
											<div>
												<Label htmlFor='push-notifications'>
													Push Notifications
												</Label>
												<p className='text-sm text-muted-foreground'>
													Receive push notifications on your devices
												</p>
											</div>
										</div>
										<Switch
											id='push-notifications'
											checked={notificationSettings.pushNotifications}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													pushNotifications: checked,
												})
											}
										/>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Notification Types</h3>
								<div className='grid gap-4'>
									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='booking-reminders'>
												Booking Reminders
											</Label>
											<p className='text-sm text-muted-foreground'>
												Reminders about upcoming bookings
											</p>
										</div>
										<Switch
											id='booking-reminders'
											checked={notificationSettings.bookingReminders}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													bookingReminders: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='service-updates'>Service Updates</Label>
											<p className='text-sm text-muted-foreground'>
												Updates about services you have booked
											</p>
										</div>
										<Switch
											id='service-updates'
											checked={notificationSettings.serviceUpdates}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													serviceUpdates: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='payment-notifications'>
												Payment Notifications
											</Label>
											<p className='text-sm text-muted-foreground'>
												Notifications about payments and receipts
											</p>
										</div>
										<Switch
											id='payment-notifications'
											checked={notificationSettings.paymentNotifications}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													paymentNotifications: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='marketing-emails'>Marketing Emails</Label>
											<p className='text-sm text-muted-foreground'>
												Promotional offers and newsletters
											</p>
										</div>
										<Switch
											id='marketing-emails'
											checked={notificationSettings.marketingEmails}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													marketingEmails: checked,
												})
											}
										/>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={() => handleSaveSettings("notification")}>
								Save Notification Settings
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				{/* Privacy Tab */}
				<TabsContent
					value='privacy'
					className='space-y-4 pt-4'
				>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Eye className='h-5 w-5' />
								Privacy Settings
							</CardTitle>
							<CardDescription>
								Control your privacy and data sharing preferences
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='profile-visibility'>Profile Visibility</Label>
									<Select
										value={privacySettings.profileVisibility}
										onValueChange={(value) =>
											setPrivacySettings({
												...privacySettings,
												profileVisibility: value,
											})
										}
									>
										<SelectTrigger id='profile-visibility'>
											<SelectValue placeholder='Select visibility' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='public'>
												Public - Visible to everyone
											</SelectItem>
											<SelectItem value='private'>
												Private - Only visible to service providers you book
											</SelectItem>
											<SelectItem value='hidden'>
												Hidden - Only visible to you
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className='grid gap-4 pt-2'>
									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='share-booking-history'>
												Share Booking History
											</Label>
											<p className='text-sm text-muted-foreground'>
												Allow service providers to see your booking history
											</p>
										</div>
										<Switch
											id='share-booking-history'
											checked={privacySettings.shareBookingHistory}
											onCheckedChange={(checked) =>
												setPrivacySettings({
													...privacySettings,
													shareBookingHistory: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='share-reviews'>
												Share Reviews Publicly
											</Label>
											<p className='text-sm text-muted-foreground'>
												Make your reviews visible to other users
											</p>
										</div>
										<Switch
											id='share-reviews'
											checked={privacySettings.shareReviews}
											onCheckedChange={(checked) =>
												setPrivacySettings({
													...privacySettings,
													shareReviews: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='allow-location'>
												Allow Location Access
											</Label>
											<p className='text-sm text-muted-foreground'>
												Allow the app to access your location for better service
												recommendations
											</p>
										</div>
										<Switch
											id='allow-location'
											checked={privacySettings.allowLocationAccess}
											onCheckedChange={(checked) =>
												setPrivacySettings({
													...privacySettings,
													allowLocationAccess: checked,
												})
											}
										/>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Data Management</h3>
								<div className='grid gap-4'>
									<Button variant='outline'>Download My Data</Button>
									<Button
										variant='outline'
										className='text-destructive'
									>
										Delete My Account
									</Button>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={() => handleSaveSettings("privacy")}>
								Save Privacy Settings
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				{/* Appearance Tab */}
				<TabsContent
					value='appearance'
					className='space-y-4 pt-4'
				>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Sun className='h-5 w-5' />
								Appearance Settings
							</CardTitle>
							<CardDescription>
								Customize how the application looks and feels
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='theme-select'>Theme</Label>
									<div className='grid grid-cols-3 gap-2'>
										<Button
											variant={
												appearanceSettings.theme === "light"
													? "default"
													: "outline"
											}
											className='flex items-center justify-center gap-2'
											onClick={() =>
												setAppearanceSettings({
													...appearanceSettings,
													theme: "light",
												})
											}
										>
											<Sun className='h-4 w-4' />
											Light
										</Button>
										<Button
											variant={
												appearanceSettings.theme === "dark"
													? "default"
													: "outline"
											}
											className='flex items-center justify-center gap-2'
											onClick={() =>
												setAppearanceSettings({
													...appearanceSettings,
													theme: "dark",
												})
											}
										>
											<Moon className='h-4 w-4' />
											Dark
										</Button>
										<Button
											variant={
												appearanceSettings.theme === "system"
													? "default"
													: "outline"
											}
											className='flex items-center justify-center gap-2'
											onClick={() =>
												setAppearanceSettings({
													...appearanceSettings,
													theme: "system",
												})
											}
										>
											<Globe className='h-4 w-4' />
											System
										</Button>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='font-size'>Font Size</Label>
									<Select
										value={appearanceSettings.fontSize}
										onValueChange={(value) =>
											setAppearanceSettings({
												...appearanceSettings,
												fontSize: value,
											})
										}
									>
										<SelectTrigger id='font-size'>
											<SelectValue placeholder='Select font size' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='small'>Small</SelectItem>
											<SelectItem value='medium'>Medium</SelectItem>
											<SelectItem value='large'>Large</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className='grid gap-4 pt-2'>
									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='reduced-motion'>Reduced Motion</Label>
											<p className='text-sm text-muted-foreground'>
												Minimize animations throughout the interface
											</p>
										</div>
										<Switch
											id='reduced-motion'
											checked={appearanceSettings.reducedMotion}
											onCheckedChange={(checked) =>
												setAppearanceSettings({
													...appearanceSettings,
													reducedMotion: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='high-contrast'>High Contrast</Label>
											<p className='text-sm text-muted-foreground'>
												Increase contrast for better visibility
											</p>
										</div>
										<Switch
											id='high-contrast'
											checked={appearanceSettings.highContrast}
											onCheckedChange={(checked) =>
												setAppearanceSettings({
													...appearanceSettings,
													highContrast: checked,
												})
											}
										/>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={() => handleSaveSettings("appearance")}>
								Save Appearance Settings
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				{/* Security Tab */}
				<TabsContent
					value='security'
					className='space-y-4 pt-4'
				>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Lock className='h-5 w-5' />
								Security Settings
							</CardTitle>
							<CardDescription>
								Manage your account security and authentication options
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='two-factor-auth'>
											Two-Factor Authentication
										</Label>
										<p className='text-sm text-muted-foreground'>
											Add an extra layer of security to your account
										</p>
									</div>
									<Switch
										id='two-factor-auth'
										checked={securitySettings.twoFactorAuth}
										onCheckedChange={(checked) =>
											setSecuritySettings({
												...securitySettings,
												twoFactorAuth: checked,
											})
										}
									/>
								</div>

								{securitySettings.twoFactorAuth && (
									<div className='rounded-md border p-4 mt-2'>
										<h4 className='font-medium mb-2'>
											Set Up Two-Factor Authentication
										</h4>
										<p className='text-sm text-muted-foreground mb-4'>
											Two-factor authentication adds an extra layer of security
											to your account by requiring a code from your phone in
											addition to your password.
										</p>
										<Button variant='outline'>Set Up Now</Button>
									</div>
								)}

								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='login-notifications'>
											Login Notifications
										</Label>
										<p className='text-sm text-muted-foreground'>
											Receive notifications when someone logs into your account
										</p>
									</div>
									<Switch
										id='login-notifications'
										checked={securitySettings.loginNotifications}
										onCheckedChange={(checked) =>
											setSecuritySettings({
												...securitySettings,
												loginNotifications: checked,
											})
										}
									/>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='session-timeout'>
										Session Timeout (minutes)
									</Label>
									<Select
										value={securitySettings.sessionTimeout}
										onValueChange={(value) =>
											setSecuritySettings({
												...securitySettings,
												sessionTimeout: value,
											})
										}
									>
										<SelectTrigger id='session-timeout'>
											<SelectValue placeholder='Select timeout duration' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='15'>15 minutes</SelectItem>
											<SelectItem value='30'>30 minutes</SelectItem>
											<SelectItem value='60'>1 hour</SelectItem>
											<SelectItem value='120'>2 hours</SelectItem>
											<SelectItem value='never'>Never</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Password Management</h3>
								<div className='space-y-2'>
									<Label htmlFor='current-password'>Current Password</Label>
									<Input
										id='current-password'
										type='password'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='new-password'>New Password</Label>
									<Input
										id='new-password'
										type='password'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='confirm-password'>Confirm New Password</Label>
									<Input
										id='confirm-password'
										type='password'
									/>
								</div>
								<Button
									variant='outline'
									className='w-full'
								>
									Change Password
								</Button>
							</div>

							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Connected Accounts</h3>
								<div className='rounded-md border p-4'>
									<p className='text-sm text-muted-foreground'>
										No connected accounts. You can connect your account with
										Google, Facebook, or Apple for easier login.
									</p>
									<div className='flex gap-2 mt-4'>
										<Button
											variant='outline'
											size='sm'
										>
											Connect Google
										</Button>
										<Button
											variant='outline'
											size='sm'
										>
											Connect Facebook
										</Button>
										<Button
											variant='outline'
											size='sm'
										>
											Connect Apple
										</Button>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Recent Activity</h3>
								<div className='rounded-md border p-4'>
									<div className='space-y-3'>
										<div className='flex justify-between'>
											<div>
												<p className='text-sm font-medium'>
													Login from Chrome on Windows
												</p>
												<p className='text-xs text-muted-foreground'>
													IP: 192.168.1.1
												</p>
											</div>
											<p className='text-xs text-muted-foreground'>
												Today, 10:30 AM
											</p>
										</div>
										<div className='flex justify-between'>
											<div>
												<p className='text-sm font-medium'>
													Login from Safari on iPhone
												</p>
												<p className='text-xs text-muted-foreground'>
													IP: 192.168.1.2
												</p>
											</div>
											<p className='text-xs text-muted-foreground'>
												Yesterday, 8:15 PM
											</p>
										</div>
									</div>
									<Button
										variant='link'
										className='px-0 mt-2'
									>
										View All Activity
									</Button>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={() => handleSaveSettings("security")}>
								Save Security Settings
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
