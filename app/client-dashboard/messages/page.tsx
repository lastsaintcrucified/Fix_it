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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";

export default function ClientMessagesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedConversation, setSelectedConversation] = useState<
		number | null
	>(1); // Default to first conversation
	const [newMessage, setNewMessage] = useState("");

	// Sample conversations data
	const conversations = [
		{
			id: 1,
			provider: {
				id: 1,
				name: "Smith's Professional Services",
				avatar: "/placeholder-user.jpg",
				initials: "SP",
			},
			lastMessage:
				"Your cleaning service is scheduled for tomorrow at 10:00 AM.",
			timestamp: "10:30 AM",
			unread: true,
			messages: [
				{
					id: 1,
					sender: "provider",
					text: "Hello! Thank you for booking our Deep Home Cleaning service.",
					timestamp: "Yesterday, 9:15 AM",
				},
				{
					id: 2,
					sender: "provider",
					text: "Your cleaning service is scheduled for tomorrow at 10:00 AM. Please ensure someone is home to let our team in.",
					timestamp: "Yesterday, 9:16 AM",
				},
				{
					id: 3,
					sender: "client",
					text: "Great, thank you! I'll be home. Do I need to prepare anything?",
					timestamp: "Yesterday, 10:30 AM",
				},
				{
					id: 4,
					sender: "provider",
					text: "No preparation needed! Just make sure our team has access to all areas that need cleaning. We'll bring all supplies and equipment.",
					timestamp: "Yesterday, 11:05 AM",
				},
			],
		},
		{
			id: 2,
			provider: {
				id: 2,
				name: "Green Thumb Gardening",
				avatar: "/placeholder-user.jpg",
				initials: "GT",
			},
			lastMessage:
				"We'll see you on Wednesday for the lawn mowing service. Please ensure your gate is unlocked.",
			timestamp: "Yesterday",
			unread: false,
			messages: [
				{
					id: 1,
					sender: "provider",
					text: "Hello! This is Green Thumb Gardening. We're confirming your lawn mowing service.",
					timestamp: "2 days ago, 2:15 PM",
				},
				{
					id: 2,
					sender: "client",
					text: "Hi! Yes, I'd like to schedule it for Wednesday if possible.",
					timestamp: "2 days ago, 3:20 PM",
				},
				{
					id: 3,
					sender: "provider",
					text: "We'll see you on Wednesday for the lawn mowing service. Please ensure your gate is unlocked.",
					timestamp: "Yesterday, 9:30 AM",
				},
			],
		},
		{
			id: 3,
			provider: {
				id: 3,
				name: "Johnson's Electrical Solutions",
				avatar: "/placeholder-user.jpg",
				initials: "JE",
			},
			lastMessage:
				"I'll need access to your electrical panel for the installation.",
			timestamp: "Monday",
			unread: false,
			messages: [
				{
					id: 1,
					sender: "provider",
					text: "Hello! This is David from Johnson's Electrical Solutions. I'm scheduled to install your new outlets on Friday.",
					timestamp: "Monday, 11:20 AM",
				},
				{
					id: 2,
					sender: "provider",
					text: "I'll need access to your electrical panel for the installation.",
					timestamp: "Monday, 11:21 AM",
				},
			],
		},
	];

	// Filter conversations based on search term
	const filteredConversations = conversations.filter(
		(conversation) =>
			conversation.provider.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Get selected conversation
	const activeConversation = conversations.find(
		(conv) => conv.id === selectedConversation
	);

	// Handle send message
	const handleSendMessage = () => {
		if (!newMessage.trim() || !selectedConversation) return;

		// In a real app, you would send the message to the server
		console.log(
			"Sending message:",
			newMessage,
			"to conversation:",
			selectedConversation
		);

		// Clear the input
		setNewMessage("");
	};

	return (
		<div className='flex flex-col gap-6 h-[calc(100vh-10rem)]'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>Messages</h1>
				<p className='text-muted-foreground'>
					Communicate with your service providers
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0'>
				{/* Conversations List */}
				<Card className='md:col-span-1 flex flex-col'>
					<CardHeader className='px-4 py-3 space-y-2'>
						<CardTitle className='text-lg'>Conversations</CardTitle>
						<div className='relative'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search messages...'
								className='pl-8'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</CardHeader>
					<CardContent className='flex-1 overflow-auto p-0'>
						{filteredConversations.length === 0 ? (
							<div className='flex flex-col items-center justify-center h-full p-4 text-center'>
								<p className='text-muted-foreground'>No conversations found</p>
							</div>
						) : (
							<div className='divide-y'>
								{filteredConversations.map((conversation) => (
									<div
										key={conversation.id}
										className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
											selectedConversation === conversation.id ? "bg-muted" : ""
										}`}
										onClick={() => setSelectedConversation(conversation.id)}
									>
										<Avatar className='h-10 w-10'>
											<AvatarImage
												src={conversation.provider.avatar || "/placeholder.svg"}
												alt={conversation.provider.name}
											/>
											<AvatarFallback>
												{conversation.provider.initials}
											</AvatarFallback>
										</Avatar>
										<div className='flex-1 min-w-0'>
											<div className='flex justify-between items-baseline'>
												<h4 className='font-medium truncate'>
													{conversation.provider.name}
												</h4>
												<span className='text-xs text-muted-foreground whitespace-nowrap ml-2'>
													{conversation.timestamp}
												</span>
											</div>
											<p className='text-sm text-muted-foreground truncate'>
												{conversation.lastMessage}
											</p>
										</div>
										{conversation.unread && (
											<div className='w-2 h-2 rounded-full bg-primary mt-2'></div>
										)}
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Message Thread */}
				<Card className='md:col-span-2 flex flex-col'>
					{selectedConversation && activeConversation ? (
						<>
							<CardHeader className='px-6 py-4 border-b'>
								<div className='flex items-center gap-3'>
									<Avatar className='h-10 w-10'>
										<AvatarImage
											src={
												activeConversation.provider.avatar || "/placeholder.svg"
											}
											alt={activeConversation.provider.name}
										/>
										<AvatarFallback>
											{activeConversation.provider.initials}
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className='text-lg'>
											{activeConversation.provider.name}
										</CardTitle>
										<CardDescription>Service Provider</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className='flex-1 overflow-auto p-6 space-y-4'>
								{activeConversation.messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.sender === "client"
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`max-w-[80%] rounded-lg p-3 ${
												message.sender === "client"
													? "bg-primary text-primary-foreground"
													: "bg-muted"
											}`}
										>
											<p className='text-sm'>{message.text}</p>
											<p className='text-xs mt-1 opacity-70'>
												{message.timestamp}
											</p>
										</div>
									</div>
								))}
							</CardContent>
							<div className='p-4 border-t'>
								<div className='flex gap-2'>
									<Textarea
										placeholder='Type your message...'
										className='min-h-[2.5rem] max-h-32'
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												handleSendMessage();
											}
										}}
									/>
									<Button
										size='icon'
										onClick={handleSendMessage}
										disabled={!newMessage.trim()}
									>
										<Send className='h-4 w-4' />
										<span className='sr-only'>Send message</span>
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className='flex flex-col items-center justify-center h-full p-6 text-center'>
							<p className='text-muted-foreground mb-2'>
								Select a conversation to view messages
							</p>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
