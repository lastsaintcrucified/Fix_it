/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
import { Search, Send, Loader2, Plus, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
	collection,
	query,
	where,
	orderBy,
	getDocs,
	addDoc,
	updateDoc,
	doc,
	serverTimestamp,
	onSnapshot,
	Timestamp,
	getDoc,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function ClientMessagesPage() {
	const { user } = useAuth();
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const providerId = searchParams.get("provider");

	const [searchTerm, setSearchTerm] = useState("");
	const [conversations, setConversations] = useState<any[]>([]);
	const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
	const [selectedConversation, setSelectedConversation] = useState<any>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [newConversationOpen, setNewConversationOpen] = useState(false);
	const [providers, setProviders] = useState<any[]>([]);
	const [filteredProviders, setFilteredProviders] = useState<any[]>([]);
	const [providerSearchTerm, setProviderSearchTerm] = useState("");
	const [selectedProvider, setSelectedProvider] = useState<any>(null);
	const [initialMessage, setInitialMessage] = useState("");
	const [creatingConversation, setCreatingConversation] = useState(false);

	// Fetch conversations when component mounts
	useEffect(() => {
		if (user) {
			fetchConversations();
			fetchProviders();
		}
	}, [user]);

	// Handle provider ID from URL
	useEffect(() => {
		if (providerId && user) {
			handleProviderFromUrl(providerId);
		}
	}, [providerId, user, conversations]);

	// Filter conversations when search term changes
	useEffect(() => {
		if (conversations.length > 0) {
			filterConversations();
		}
	}, [searchTerm, conversations]);

	// Filter providers when search term changes
	useEffect(() => {
		if (providers.length > 0) {
			filterProviders();
		}
	}, [providerSearchTerm, providers]);

	// Subscribe to messages when a conversation is selected
	useEffect(() => {
		if (selectedConversation) {
			const unsubscribe = subscribeToMessages(selectedConversation.id);
			return () => unsubscribe();
		}
	}, [selectedConversation]);

	const handleProviderFromUrl = async (providerId: string) => {
		// Check if we already have a conversation with this provider
		const existingConversation = conversations.find(
			(conv) => conv.providerId === providerId
		);

		if (existingConversation) {
			setSelectedConversation(existingConversation);
			return;
		}

		// If not, fetch provider details and open new conversation dialog
		try {
			const providerDoc = await getDoc(doc(db, "users", providerId));

			if (providerDoc.exists()) {
				const providerData = { id: providerDoc.id, ...providerDoc.data() };
				setSelectedProvider(providerData);
				setNewConversationOpen(true);
			} else {
				toast({
					title: "Provider not found",
					description: "The provider you're trying to message doesn't exist",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error fetching provider:", error);
			toast({
				title: "Error",
				description: "Failed to load provider details",
				variant: "destructive",
			});
		}
	};

	const fetchConversations = async () => {
		if (!user) return;

		setLoading(true);
		try {
			const conversationsRef = collection(db, "conversations");
			const q = query(
				conversationsRef,
				where("clientId", "==", user.uid),
				orderBy("updatedAt", "desc")
			);

			const querySnapshot = await getDocs(q);
			const conversationsList: any[] = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				conversationsList.push({
					id: doc.id,
					...data,
					updatedAt:
						data.updatedAt instanceof Timestamp
							? data.updatedAt.toDate()
							: new Date(data.updatedAt),
				});
			});

			setConversations(conversationsList);

			// Select the first conversation by default if available and none is selected
			if (conversationsList.length > 0 && !selectedConversation) {
				setSelectedConversation(conversationsList[0]);
			}
		} catch (error) {
			console.error("Error fetching conversations:", error);
			toast({
				title: "Error",
				description: "Failed to load conversations",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchProviders = async () => {
		try {
			const providersRef = collection(db, "users");
			const q = query(providersRef, where("role", "==", "provider"));

			const querySnapshot = await getDocs(q);
			const providersList: any[] = [];

			querySnapshot.forEach((doc) => {
				providersList.push({ id: doc.id, ...doc.data() });
			});

			setProviders(providersList);
			setFilteredProviders(providersList);
		} catch (error) {
			console.error("Error fetching providers:", error);
		}
	};

	const filterConversations = () => {
		if (!conversations) return;

		if (!searchTerm) {
			setFilteredConversations(conversations);
			return;
		}

		const term = searchTerm.toLowerCase();
		const filtered = conversations.filter(
			(conversation) =>
				conversation.providerName?.toLowerCase().includes(term) ||
				conversation.lastMessage?.toLowerCase().includes(term)
		);

		setFilteredConversations(filtered);
	};

	const filterProviders = () => {
		if (!providers) return;

		if (!providerSearchTerm) {
			setFilteredProviders(providers);
			return;
		}

		const term = providerSearchTerm.toLowerCase();
		const filtered = providers.filter(
			(provider) =>
				provider.displayName?.toLowerCase().includes(term) ||
				provider.businessName?.toLowerCase().includes(term)
		);

		setFilteredProviders(filtered);
	};

	const subscribeToMessages = (conversationId: string) => {
		const messagesRef = collection(db, "messages");
		const q = query(
			messagesRef,
			where("conversationId", "==", conversationId),
			orderBy("createdAt", "asc")
		);

		return onSnapshot(
			q,
			(snapshot) => {
				const messagesList: any[] = [];
				snapshot.forEach((doc) => {
					const data = doc.data();
					messagesList.push({
						id: doc.id,
						...data,
						createdAt:
							data.createdAt instanceof Timestamp
								? data.createdAt.toDate()
								: new Date(data.createdAt),
					});
				});
				setMessages(messagesList);

				// Mark messages as read
				markMessagesAsRead(conversationId);
			},
			(error) => {
				console.error("Error subscribing to messages:", error);
			}
		);
	};

	const markMessagesAsRead = async (conversationId: string) => {
		if (!user) return;

		try {
			// Update conversation unread count
			const conversationRef = doc(db, "conversations", conversationId);
			await updateDoc(conversationRef, {
				unreadCount: 0,
			});

			// Mark all provider messages as read
			const messagesRef = collection(db, "messages");
			const q = query(
				messagesRef,
				where("conversationId", "==", conversationId),
				where("senderType", "==", "provider"),
				where("read", "==", false)
			);

			const querySnapshot = await getDocs(q);
			querySnapshot.forEach(async (document) => {
				await updateDoc(doc(db, "messages", document.id), {
					read: true,
				});
			});
		} catch (error) {
			console.error("Error marking messages as read:", error);
		}
	};

	const handleSendMessage = async () => {
		if (!newMessage.trim() || !selectedConversation || !user) return;

		try {
			// Add message to Firestore
			await addDoc(collection(db, "messages"), {
				conversationId: selectedConversation.id,
				senderId: user.uid,
				senderName: user.displayName || "Client",
				senderType: "client",
				text: newMessage,
				createdAt: serverTimestamp(),
				read: false,
			});

			// Update conversation with last message
			const conversationRef = doc(db, "conversations", selectedConversation.id);
			await updateDoc(conversationRef, {
				lastMessage: newMessage,
				lastMessageDate: serverTimestamp(),
				updatedAt: serverTimestamp(),
				unreadCount: 1, // Provider has 1 unread message
			});

			// Clear the input
			setNewMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
			toast({
				title: "Error",
				description: "Failed to send message",
				variant: "destructive",
			});
		}
	};

	const handleCreateConversation = async () => {
		if (!user || !selectedProvider || !initialMessage.trim()) return;

		setCreatingConversation(true);

		try {
			// Check if conversation already exists
			const conversationsRef = collection(db, "conversations");
			const q = query(
				conversationsRef,
				where("clientId", "==", user.uid),
				where("providerId", "==", selectedProvider.id)
			);

			const querySnapshot = await getDocs(q);
			let conversationId: string;

			if (querySnapshot.empty) {
				// Create new conversation
				const newConversation = {
					clientId: user.uid,
					clientName: user.displayName || "Client",
					providerId: selectedProvider.id,
					providerName:
						selectedProvider.displayName || selectedProvider.businessName,
					lastMessage: initialMessage,
					lastMessageDate: serverTimestamp(),
					unreadCount: 1, // Provider has 1 unread message
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
				};

				const docRef = await addDoc(conversationsRef, newConversation);
				conversationId = docRef.id;
			} else {
				// Use existing conversation
				conversationId = querySnapshot.docs[0].id;

				// Update conversation
				await updateDoc(doc(db, "conversations", conversationId), {
					lastMessage: initialMessage,
					lastMessageDate: serverTimestamp(),
					updatedAt: serverTimestamp(),
					unreadCount: 1, // Provider has 1 unread message
				});
			}

			// Add message
			await addDoc(collection(db, "messages"), {
				conversationId,
				senderId: user.uid,
				senderName: user.displayName || "Client",
				senderType: "client",
				text: initialMessage,
				createdAt: serverTimestamp(),
				read: false,
			});

			// Refresh conversations and select the new one
			await fetchConversations();

			// Find the new conversation in the list
			const newConversation = conversations.find(
				(c) => c.providerId === selectedProvider.id
			);
			if (newConversation) {
				setSelectedConversation(newConversation);
			}

			// Reset state
			setNewConversationOpen(false);
			setSelectedProvider(null);
			setInitialMessage("");

			toast({
				title: "Conversation started",
				description: "Your message has been sent",
			});
		} catch (error) {
			console.error("Error creating conversation:", error);
			toast({
				title: "Error",
				description: "Failed to start conversation",
				variant: "destructive",
			});
		} finally {
			setCreatingConversation(false);
		}
	};

	const formatMessageTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	const formatConversationTime = (date: Date) => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date >= today) {
			return formatMessageTime(date);
		} else if (date >= yesterday) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString([], { month: "short", day: "numeric" });
		}
	};

	return (
		<div className='flex flex-col gap-6 h-[calc(100vh-10rem)]'>
			<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Messages</h1>
					<p className='text-muted-foreground'>
						Communicate with your service providers
					</p>
				</div>
				<Dialog
					open={newConversationOpen}
					onOpenChange={setNewConversationOpen}
				>
					<DialogTrigger asChild>
						<Button className='flex items-center gap-2'>
							<UserPlus className='h-4 w-4' />
							New Message
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>New Message</DialogTitle>
							<DialogDescription>
								Start a conversation with a service provider
							</DialogDescription>
						</DialogHeader>
						<div className='grid gap-4 py-4'>
							{selectedProvider ? (
								<div className='flex items-center gap-3 p-2 border rounded-md'>
									<Avatar className='h-10 w-10'>
										<AvatarFallback>
											{selectedProvider.displayName?.charAt(0) || "P"}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-medium'>
											{selectedProvider.displayName}
										</p>
										<p className='text-sm text-muted-foreground'>
											{selectedProvider.businessName || "Service Provider"}
										</p>
									</div>
									<Button
										variant='ghost'
										size='sm'
										className='ml-auto'
										onClick={() => setSelectedProvider(null)}
									>
										Change
									</Button>
								</div>
							) : (
								<div className='space-y-2'>
									<label className='text-sm font-medium'>Select Provider</label>
									<div className='relative'>
										<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
										<Input
											placeholder='Search providers...'
											className='pl-8'
											value={providerSearchTerm}
											onChange={(e) => setProviderSearchTerm(e.target.value)}
										/>
									</div>
									<div className='max-h-[200px] overflow-y-auto border rounded-md'>
										{filteredProviders.length === 0 ? (
											<div className='p-4 text-center text-sm text-muted-foreground'>
												No providers found
											</div>
										) : (
											filteredProviders.map((provider) => (
												<div
													key={provider.id}
													className='flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-0'
													onClick={() => setSelectedProvider(provider)}
												>
													<Avatar className='h-8 w-8'>
														<AvatarFallback>
															{provider.displayName?.charAt(0) || "P"}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className='font-medium'>
															{provider.displayName}
														</p>
														<p className='text-xs text-muted-foreground'>
															{provider.businessName || "Service Provider"}
														</p>
													</div>
												</div>
											))
										)}
									</div>
								</div>
							)}
							<div className='space-y-2'>
								<label className='text-sm font-medium'>Message</label>
								<Textarea
									placeholder='Type your message...'
									value={initialMessage}
									onChange={(e) => setInitialMessage(e.target.value)}
									rows={4}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type='submit'
								onClick={handleCreateConversation}
								disabled={
									!selectedProvider ||
									!initialMessage.trim() ||
									creatingConversation
								}
							>
								{creatingConversation ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Sending...
									</>
								) : (
									"Send Message"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
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
						{loading ? (
							<div className='flex flex-col items-center justify-center h-full p-4 text-center'>
								<Loader2 className='h-8 w-8 animate-spin text-muted-foreground mb-2' />
								<p className='text-muted-foreground'>
									Loading conversations...
								</p>
							</div>
						) : filteredConversations.length === 0 ? (
							<div className='flex flex-col items-center justify-center h-full p-4 text-center'>
								<p className='text-muted-foreground'>
									{searchTerm
										? "No conversations found"
										: "No conversations yet"}
								</p>
								{!searchTerm && (
									<Button
										variant='outline'
										size='sm'
										className='mt-2'
										onClick={() => setNewConversationOpen(true)}
									>
										<Plus className='h-4 w-4 mr-2' />
										Start a conversation
									</Button>
								)}
							</div>
						) : (
							<div className='divide-y'>
								{filteredConversations.map((conversation) => (
									<div
										key={conversation.id}
										className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
											selectedConversation?.id === conversation.id
												? "bg-muted"
												: ""
										}`}
										onClick={() => setSelectedConversation(conversation)}
									>
										<Avatar className='h-10 w-10'>
											<AvatarImage
												src='/placeholder-user.jpg'
												alt={conversation.providerName}
											/>
											<AvatarFallback>
												{conversation.providerName
													?.split(" ")
													.map((n: string) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div className='flex-1 min-w-0'>
											<div className='flex justify-between items-baseline'>
												<h4 className='font-medium truncate'>
													{conversation.providerName}
												</h4>
												<span className='text-xs text-muted-foreground whitespace-nowrap ml-2'>
													{conversation.updatedAt
														? formatConversationTime(conversation.updatedAt)
														: ""}
												</span>
											</div>
											<p className='text-sm text-muted-foreground truncate'>
												{conversation.lastMessage}
											</p>
										</div>
										{conversation.unreadCount > 0 && (
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
					{selectedConversation ? (
						<>
							<CardHeader className='px-6 py-4 border-b'>
								<div className='flex items-center gap-3'>
									<Avatar className='h-10 w-10'>
										<AvatarImage
											src='/placeholder-user.jpg'
											alt={selectedConversation.providerName}
										/>
										<AvatarFallback>
											{selectedConversation.providerName
												?.split(" ")
												.map((n: string) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className='text-lg'>
											{selectedConversation.providerName}
										</CardTitle>
										<CardDescription>Service Provider</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className='flex-1 overflow-auto p-6 space-y-4'>
								{messages.length === 0 ? (
									<div className='flex flex-col items-center justify-center h-full text-center'>
										<p className='text-muted-foreground'>No messages yet</p>
										<p className='text-sm text-muted-foreground'>
											Start the conversation by sending a message
										</p>
									</div>
								) : (
									messages.map((message) => (
										<div
											key={message.id}
											className={`flex ${
												message.senderType === "client"
													? "justify-end"
													: "justify-start"
											}`}
										>
											<div
												className={`max-w-[80%] rounded-lg p-3 ${
													message.senderType === "client"
														? "bg-primary text-primary-foreground"
														: "bg-muted"
												}`}
											>
												<p className='text-sm'>{message.text}</p>
												<p className='text-xs mt-1 opacity-70'>
													{message.createdAt
														? formatMessageTime(message.createdAt)
														: ""}
												</p>
											</div>
										</div>
									))
								)}
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
							<p className='text-sm text-muted-foreground'>
								Or start a new conversation with a service provider
							</p>
							<Button
								variant='outline'
								className='mt-4'
								onClick={() => setNewConversationOpen(true)}
							>
								<UserPlus className='h-4 w-4 mr-2' />
								New Conversation
							</Button>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
