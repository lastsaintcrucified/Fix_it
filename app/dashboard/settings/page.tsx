/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
	Bell,
	Lock,
	Eye,
	Moon,
	Sun,
	Smartphone,
	Mail,
	Globe,
	Briefcase,
	DollarSign,
} from "lucide-react";

export default function ProviderSettingsPage() {
	const { toast } = useToast();
	const { user, userData } = useAuth();

	// Business settings
	const [businessSettings, setBusinessSettings] = useState({
		businessName: userData?.businessName || "Your Business Name",
		businessDescription:
			"Professional service provider with years of experience in the industry.",
		businessAddress: "123 Business St, Suite 101",
		businessPhone: "+1 (555) 987-6543",
		businessEmail: user?.email || "business@example.com",
		businessWebsite: "https://yourbusiness.com",
		businessHours: {
			monday: { open: "09:00", close: "17:00", closed: false },
			tuesday: { open: "09:00", close: "17:00", closed: false },
			wednesday: { open: "09:00", close: "17:00", closed: false },
			thursday: { open: "09:00", close: "17:00", closed: false },
			friday: { open: "09:00", close: "17:00", closed: false },
			saturday: { open: "10:00", close: "15:00", closed: false },
			sunday: { open: "10:00", close: "15:00", closed: true },
		},
	});

	// Payment settings
	const [paymentSettings, setPaymentSettings] = useState({
		paymentMethods: ["credit_card", "paypal"],
		bankAccount: {
			accountName: "Your Business Account",
			accountNumber: "XXXX-XXXX-XXXX-1234",
			routingNumber: "XXXXXXXX",
		},
		autoWithdrawal: true,
		withdrawalThreshold: "100",
		taxInformation: {
			taxId: "XX-XXXXXXX",
			businessType: "sole_proprietor",
		},
	});

	// Notification settings
	const [notificationSettings, setNotificationSettings] = useState({
		emailNotifications: true,
		smsNotifications: true,
		pushNotifications: true,
		bookingAlerts: true,
		paymentAlerts: true,
		reviewAlerts: true,
		marketingEmails: false,
	});

	// Privacy settings
	const [privacySettings, setPrivacySettings] = useState({
		profileVisibility: "public",
		showContactInfo: true,
		showBusinessHours: true,
		showReviews: true,
	});

	// Appearance settings
	const [appearanceSettings, setAppearanceSettings] = useState({
		theme: "system",
		accentColor: "blue",
		compactView: false,
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
					Manage your business settings and preferences
				</p>
			</div>

			<Tabs
				defaultValue='business'
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-6'>
					<TabsTrigger value='business'>Business</TabsTrigger>
					<TabsTrigger value='payment'>Payment</TabsTrigger>
					<TabsTrigger value='notifications'>Notifications</TabsTrigger>
					<TabsTrigger value='privacy'>Privacy</TabsTrigger>
					<TabsTrigger value='appearance'>Appearance</TabsTrigger>
					<TabsTrigger value='security'>Security</TabsTrigger>
				</TabsList>

				{/* Business Tab */}
				<TabsContent
					value='business'
					className='space-y-4 pt-4'
				>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Briefcase className='h-5 w-5' />
								Business Information
							</CardTitle>
							<CardDescription>
								Manage your business details and operating hours
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='business-name'>Business Name</Label>
									<Input
										id='business-name'
										value={businessSettings.businessName}
										onChange={(e) =>
											setBusinessSettings({
												...businessSettings,
												businessName: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='business-email'>Business Email</Label>
									<Input
										id='business-email'
										type='email'
										value={businessSettings.businessEmail}
										onChange={(e) =>
											setBusinessSettings({
												...businessSettings,
												businessEmail: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='business-phone'>Business Phone</Label>
									<Input
										id='business-phone'
										value={businessSettings.businessPhone}
										onChange={(e) =>
											setBusinessSettings({
												...businessSettings,
												businessPhone: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='business-website'>Business Website</Label>
									<Input
										id='business-website'
										value={businessSettings.businessWebsite}
										onChange={(e) =>
											setBusinessSettings({
												...businessSettings,
												businessWebsite: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2 md:col-span-2'>
									<Label htmlFor='business-address'>Business Address</Label>
									<Input
										id='business-address'
										value={businessSettings.businessAddress}
										onChange={(e) =>
											setBusinessSettings({
												...businessSettings,
												businessAddress: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2 md:col-span-2'>
									<Label htmlFor='business-description'>
										Business Description
									</Label>
									<Textarea
										id='business-description'
										value={businessSettings.businessDescription}
										onChange={(e) =>
											setBusinessSettings({
												...businessSettings,
												businessDescription: e.target.value,
											})
										}
										rows={3}
									/>
								</div>
							</div>

							<div className='space-y-4'>
								<div className='space-y-3'>
									{Object.entries(businessSettings.businessHours).map(
										([day, hours]) => (
											<div
												key={`day-${day}`}
												className='flex items-center gap-4'
											>
												<div className='w-24 font-medium capitalize'>{day}</div>
												<div className='flex items-center gap-2'>
													<Switch
														id={`${day}-open`}
														checked={!hours.closed}
														onCheckedChange={(checked) => {
															const updatedHours = {
																...businessSettings.businessHours,
																[day]: { ...hours, closed: !checked },
															};

															// console.log(typeof day, checked, "gf");
															// updatedHours[day].closed = !checked;
															setBusinessSettings({
																...businessSettings,
																businessHours: updatedHours,
															});
														}}
													/>
													<span className='text-sm text-muted-foreground'>
														{hours.closed ? "Closed" : "Open"}
													</span>
													{!hours.closed && (
														<>
															<div className='flex items-center gap-2'>
																<Input
																	type='time'
																	className='w-32'
																	value={hours.open}
																	onChange={(e) => {
																		const updatedHours = {
																			...businessSettings.businessHours,
																			[day]: { ...hours, open: e.target.value },
																		};
																		// console.log(e);
																		// updatedHours[day].open = e.target.value;
																		setBusinessSettings({
																			...businessSettings,
																			businessHours: updatedHours,
																		});
																	}}
																/>
																<span>to</span>
																<Input
																	type='time'
																	className='w-32'
																	value={hours.close}
																	onChange={(e) => {
																		const updatedHours = {
																			...businessSettings.businessHours,
																			[day]: {
																				...hours,
																				close: e.target.value,
																			},
																		};
																		// console.log(e);
																		// updatedHours[day].close = e.target.value;
																		setBusinessSettings({
																			...businessSettings,
																			businessHours: updatedHours,
																		});
																	}}
																/>
															</div>
														</>
													)}
												</div>
											</div>
										)
									)}
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={() => handleSaveSettings("business")}>
								Save Business Settings
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				{/* Payment Tab */}
				<TabsContent
					value='payment'
					className='space-y-4 pt-4'
				>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<DollarSign className='h-5 w-5' />
								Payment Settings
							</CardTitle>
							<CardDescription>
								Manage your payment methods and payout preferences
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>
									Payment Methods You Accept
								</h3>
								<div className='grid gap-2'>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											id='credit-card'
											className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
											checked={paymentSettings.paymentMethods.includes(
												"credit_card"
											)}
											onChange={(e) => {
												if (e.target.checked) {
													setPaymentSettings({
														...paymentSettings,
														paymentMethods: [
															...paymentSettings.paymentMethods,
															"credit_card",
														],
													});
												} else {
													setPaymentSettings({
														...paymentSettings,
														paymentMethods:
															paymentSettings.paymentMethods.filter(
																(m) => m !== "credit_card"
															),
													});
												}
											}}
										/>
										<Label htmlFor='credit-card'>Credit/Debit Cards</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											id='paypal'
											className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
											checked={paymentSettings.paymentMethods.includes(
												"paypal"
											)}
											onChange={(e) => {
												if (e.target.checked) {
													setPaymentSettings({
														...paymentSettings,
														paymentMethods: [
															...paymentSettings.paymentMethods,
															"paypal",
														],
													});
												} else {
													setPaymentSettings({
														...paymentSettings,
														paymentMethods:
															paymentSettings.paymentMethods.filter(
																(m) => m !== "paypal"
															),
													});
												}
											}}
										/>
										<Label htmlFor='paypal'>PayPal</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											id='bank-transfer'
											className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
											checked={paymentSettings.paymentMethods.includes(
												"bank_transfer"
											)}
											onChange={(e) => {
												if (e.target.checked) {
													setPaymentSettings({
														...paymentSettings,
														paymentMethods: [
															...paymentSettings.paymentMethods,
															"bank_transfer",
														],
													});
												} else {
													setPaymentSettings({
														...paymentSettings,
														paymentMethods:
															paymentSettings.paymentMethods.filter(
																(m) => m !== "bank_transfer"
															),
													});
												}
											}}
										/>
										<Label htmlFor='bank-transfer'>Bank Transfer</Label>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Payout Information</h3>
								<div className='grid gap-4 md:grid-cols-2'>
									<div className='space-y-2'>
										<Label htmlFor='account-name'>Account Name</Label>
										<Input
											id='account-name'
											value={paymentSettings.bankAccount.accountName}
											onChange={(e) =>
												setPaymentSettings({
													...paymentSettings,
													bankAccount: {
														...paymentSettings.bankAccount,
														accountName: e.target.value,
													},
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='account-number'>Account Number</Label>
										<Input
											id='account-number'
											value={paymentSettings.bankAccount.accountNumber}
											onChange={(e) =>
												setPaymentSettings({
													...paymentSettings,
													bankAccount: {
														...paymentSettings.bankAccount,
														accountNumber: e.target.value,
													},
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='routing-number'>Routing Number</Label>
										<Input
											id='routing-number'
											value={paymentSettings.bankAccount.routingNumber}
											onChange={(e) =>
												setPaymentSettings({
													...paymentSettings,
													bankAccount: {
														...paymentSettings.bankAccount,
														routingNumber: e.target.value,
													},
												})
											}
										/>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Payout Preferences</h3>
								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='auto-withdrawal'>
											Automatic Withdrawals
										</Label>
										<p className='text-sm text-muted-foreground'>
											Automatically transfer funds to your bank account
										</p>
									</div>
									<Switch
										id='auto-withdrawal'
										checked={paymentSettings.autoWithdrawal}
										onCheckedChange={(checked) =>
											setPaymentSettings({
												...paymentSettings,
												autoWithdrawal: checked,
											})
										}
									/>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='withdrawal-threshold'>
										Withdrawal Threshold ($)
									</Label>
									<Input
										id='withdrawal-threshold'
										type='number'
										value={paymentSettings.withdrawalThreshold}
										onChange={(e) =>
											setPaymentSettings({
												...paymentSettings,
												withdrawalThreshold: e.target.value,
											})
										}
									/>
									<p className='text-xs text-muted-foreground'>
										Minimum balance required for automatic withdrawal
									</p>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-sm font-medium'>Tax Information</h3>
								<div className='grid gap-4 md:grid-cols-2'>
									<div className='space-y-2'>
										<Label htmlFor='tax-id'>Tax ID / SSN</Label>
										<Input
											id='tax-id'
											value={paymentSettings.taxInformation.taxId}
											onChange={(e) =>
												setPaymentSettings({
													...paymentSettings,
													taxInformation: {
														...paymentSettings.taxInformation,
														taxId: e.target.value,
													},
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='business-type'>Business Type</Label>
										<Select
											value={paymentSettings.taxInformation.businessType}
											onValueChange={(value) =>
												setPaymentSettings({
													...paymentSettings,
													taxInformation: {
														...paymentSettings.taxInformation,
														businessType: value,
													},
												})
											}
										>
											<SelectTrigger id='business-type'>
												<SelectValue placeholder='Select business type' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='sole_proprietor'>
													Sole Proprietor
												</SelectItem>
												<SelectItem value='llc'>LLC</SelectItem>
												<SelectItem value='corporation'>Corporation</SelectItem>
												<SelectItem value='partnership'>Partnership</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={() => handleSaveSettings("payment")}>
								Save Payment Settings
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

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
											<Label htmlFor='booking-alerts'>Booking Alerts</Label>
											<p className='text-sm text-muted-foreground'>
												Notifications about new and updated bookings
											</p>
										</div>
										<Switch
											id='booking-alerts'
											checked={notificationSettings.bookingAlerts}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													bookingAlerts: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='payment-alerts'>Payment Alerts</Label>
											<p className='text-sm text-muted-foreground'>
												Notifications about payments and payouts
											</p>
										</div>
										<Switch
											id='payment-alerts'
											checked={notificationSettings.paymentAlerts}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													paymentAlerts: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='review-alerts'>Review Alerts</Label>
											<p className='text-sm text-muted-foreground'>
												Notifications when you receive new reviews
											</p>
										</div>
										<Switch
											id='review-alerts'
											checked={notificationSettings.reviewAlerts}
											onCheckedChange={(checked) =>
												setNotificationSettings({
													...notificationSettings,
													reviewAlerts: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='marketing-emails'>Marketing Emails</Label>
											<p className='text-sm text-muted-foreground'>
												Promotional offers and platform updates
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
											<SelectItem value='clients'>
												Clients Only - Only visible to your clients
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
											<Label htmlFor='show-contact-info'>
												Show Contact Information
											</Label>
											<p className='text-sm text-muted-foreground'>
												Display your contact information on your profile
											</p>
										</div>
										<Switch
											id='show-contact-info'
											checked={privacySettings.showContactInfo}
											onCheckedChange={(checked) =>
												setPrivacySettings({
													...privacySettings,
													showContactInfo: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='show-business-hours'>
												Show Business Hours
											</Label>
											<p className='text-sm text-muted-foreground'>
												Display your business hours on your profile
											</p>
										</div>
										<Switch
											id='show-business-hours'
											checked={privacySettings.showBusinessHours}
											onCheckedChange={(checked) =>
												setPrivacySettings({
													...privacySettings,
													showBusinessHours: checked,
												})
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<Label htmlFor='show-reviews'>Show Reviews</Label>
											<p className='text-sm text-muted-foreground'>
												Display client reviews on your profile
											</p>
										</div>
										<Switch
											id='show-reviews'
											checked={privacySettings.showReviews}
											onCheckedChange={(checked) =>
												setPrivacySettings({
													...privacySettings,
													showReviews: checked,
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
									<Label htmlFor='accent-color'>Accent Color</Label>
									<div className='grid grid-cols-4 gap-2'>
										{["blue", "green", "purple", "orange"].map((color) => (
											<Button
												key={color}
												variant={
													appearanceSettings.accentColor === color
														? "default"
														: "outline"
												}
												className={`capitalize ${
													appearanceSettings.accentColor === color
														? ""
														: "hover:bg-" +
														  color +
														  "-100 dark:hover:bg-" +
														  color +
														  "-900"
												}`}
												onClick={() =>
													setAppearanceSettings({
														...appearanceSettings,
														accentColor: color,
													})
												}
											>
												{color}
											</Button>
										))}
									</div>
								</div>

								<div className='flex items-center justify-between'>
									<div>
										<Label htmlFor='compact-view'>Compact View</Label>
										<p className='text-sm text-muted-foreground'>
											Use a more compact layout to fit more content on screen
										</p>
									</div>
									<Switch
										id='compact-view'
										checked={appearanceSettings.compactView}
										onCheckedChange={(checked) =>
											setAppearanceSettings({
												...appearanceSettings,
												compactView: checked,
											})
										}
									/>
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
								<h3 className='text-sm font-medium'>API Access</h3>
								<div className='rounded-md border p-4'>
									<p className='text-sm text-muted-foreground mb-4'>
										Generate API keys to integrate your business systems with
										our platform.
									</p>
									<Button variant='outline'>Generate API Key</Button>
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
