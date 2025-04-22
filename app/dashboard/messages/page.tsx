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
import { Search, Send, Loader2 } from "lucide-react";
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
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function ProviderMessagesPage() {
	const { user } = useAuth();
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState("");
	const [conversations, setConversations] = useState<any[]>([]);
	const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
	const [selectedConversation, setSelectedConversation] = useState<any>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);

	// Fetch conversations when component mounts
	useEffect(() => {
		if (user) {
			fetchConversations();
		}
	}, [user]);

	// Filter conversations when search term changes
	useEffect(() => {
		if (conversations.length > 0) {
			filterConversations();
		}
	}, [searchTerm, conversations]);

	// Subscribe to messages when a conversation is selected
	useEffect(() => {
		if (selectedConversation) {
			const unsubscribe = subscribeToMessages(selectedConversation.id);
			return () => unsubscribe();
		}
	}, [selectedConversation]);

	const fetchConversations = async () => {
		if (!user) return;

		setLoading(true);
		try {
			const conversationsRef = collection(db, "conversations");
			const q = query(
				conversationsRef,
				where("providerId", "==", user.uid),
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

			// Select the first conversation by default if available
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

	const filterConversations = () => {
		if (!conversations) return;

		if (!searchTerm) {
			setFilteredConversations(conversations);
			return;
		}

		const term = searchTerm.toLowerCase();
		const filtered = conversations.filter(
			(conversation) =>
				conversation.clientName?.toLowerCase().includes(term) ||
				conversation.lastMessage?.toLowerCase().includes(term)
		);

		setFilteredConversations(filtered);
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

			// Mark all client messages as read
			const messagesRef = collection(db, "messages");
			const q = query(
				messagesRef,
				where("conversationId", "==", conversationId),
				where("senderType", "==", "client"),
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
				senderName: user.displayName || "Provider",
				senderType: "provider",
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
				unreadCount: 1, // Client has 1 unread message
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
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>Messages</h1>
				<p className='text-muted-foreground'>Communicate with your clients</p>
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
												alt={conversation.clientName}
											/>
											<AvatarFallback>
												{conversation.clientName
													?.split(" ")
													.map((n: string) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div className='flex-1 min-w-0'>
											<div className='flex justify-between items-baseline'>
												<h4 className='font-medium truncate'>
													{conversation.clientName}
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
											alt={selectedConversation.clientName}
										/>
										<AvatarFallback>
											{selectedConversation.clientName
												?.split(" ")
												.map((n: string) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className='text-lg'>
											{selectedConversation.clientName}
										</CardTitle>
										<CardDescription>Client</CardDescription>
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
												message.senderType === "provider"
													? "justify-end"
													: "justify-start"
											}`}
										>
											<div
												className={`max-w-[80%] rounded-lg p-3 ${
													message.senderType === "provider"
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
								Or wait for clients to contact you
							</p>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
