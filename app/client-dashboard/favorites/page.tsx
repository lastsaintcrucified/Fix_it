/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, Search, Star, Trash } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
	getClientFavorites,
	getFavoriteServices,
	getFavoriteProviders,
	removeFromFavorites,
} from "@/lib/client-db";
import { useToast } from "@/hooks/use-toast";

export default function ClientFavoritesPage() {
	const { user } = useAuth();
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState<any[]>([]);
	const [favoriteServices, setFavoriteServices] = useState<any[]>([]);
	const [favoriteProviders, setFavoriteProviders] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFavorites = async () => {
			if (!user) return;

			try {
				setLoading(true);

				// Fetch all favorites
				const allFavorites = await getClientFavorites(user.uid);
				setFavorites(allFavorites);

				// Get detailed service and provider data
				const services = await getFavoriteServices(user.uid);
				const providers = await getFavoriteProviders(user.uid);

				setFavoriteServices(services);
				setFavoriteProviders(providers);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching favorites:", error);
				setError("Failed to load favorites. Please try again.");
				setLoading(false);
			}
		};

		fetchFavorites();
	}, [user]);

	// Filter favorites based on search term
	const filterFavorites = (list: any[]) => {
		if (!searchTerm) return list;

		const term = searchTerm.toLowerCase();
		return list.filter(
			(item) =>
				item.name?.toLowerCase().includes(term) ||
				item.provider?.toLowerCase().includes(term) ||
				item.owner?.toLowerCase().includes(term) ||
				item.category?.toLowerCase().includes(term) ||
				item.businessName?.toLowerCase().includes(term) ||
				item.providerName?.toLowerCase().includes(term)
		);
	};

	// Get category label
	const getCategoryLabel = (category: string) => {
		if (!category) return "Unknown";

		const categories: Record<string, string> = {
			cleaning: "Cleaning",
			plumbing: "Plumbing",
			electrical: "Electrical",
			gardening: "Gardening",
			fitness: "Fitness",
			beauty: "Beauty & Spa",
		};
		return categories[category] || category;
	};

	// Handle remove from favorites
	const handleRemoveFavorite = async (type: string, id: string) => {
		try {
			// Find the favorite item
			const favorite = favorites.find(
				(f) => f.type === type && f.itemId === id
			);

			if (!favorite) {
				toast({
					title: "Error",
					description: "Favorite not found",
					variant: "destructive",
				});
				return;
			}

			await removeFromFavorites(favorite.id);

			// Update local state
			setFavorites(favorites.filter((f) => f.id !== favorite.id));

			if (type === "service") {
				setFavoriteServices(favoriteServices.filter((s) => s.id !== id));
			} else {
				setFavoriteProviders(favoriteProviders.filter((p) => p.id !== id));
			}

			toast({
				title: "Removed from favorites",
				description: `The ${type} has been removed from your favorites.`,
			});
		} catch (error) {
			console.error("Error removing from favorites:", error);
			toast({
				title: "Error",
				description: "Failed to remove from favorites. Please try again.",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return (
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-3xl font-bold tracking-tight'>My Favorites</h1>
					<p className='text-muted-foreground'>Loading your favorites...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-3xl font-bold tracking-tight'>My Favorites</h1>
					<p className='text-destructive'>{error}</p>
					<Button
						onClick={() => window.location.reload()}
						className='w-fit mt-2'
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Favorites</h1>
					<p className='text-muted-foreground'>
						Services and providers you have saved
					</p>
				</div>
				<div className='relative w-full md:w-auto'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search favorites...'
						className='w-full pl-8 md:w-[200px] lg:w-[300px]'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<Tabs
				defaultValue='services'
				className='w-full'
			>
				<TabsList>
					<TabsTrigger value='services'>
						Favorite Services ({favoriteServices.length})
					</TabsTrigger>
					<TabsTrigger value='providers'>
						Favorite Providers ({favoriteProviders.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='services'
					className='space-y-6'
				>
					{filterFavorites(favoriteServices).length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10 text-center'>
								<Heart className='h-10 w-10 text-muted-foreground mb-4' />
								{searchTerm ? (
									<>
										<p className='mb-2 text-lg font-medium'>
											No matching favorites found
										</p>
										<p className='text-muted-foreground'>
											Try adjusting your search term
										</p>
									</>
								) : (
									<>
										<p className='mb-2 text-lg font-medium'>
											No favorite services yet
										</p>
										<p className='text-muted-foreground mb-4'>
											Start adding services to your favorites
										</p>
										<Link href='/services'>
											<Button>Browse Services</Button>
										</Link>
									</>
								)}
							</CardContent>
						</Card>
					) : (
						<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
							{filterFavorites(favoriteServices).map((service) => (
								<Card
									key={service.id}
									className='overflow-hidden'
								>
									<CardHeader>
										<div className='flex justify-between items-start'>
											<div>
												<CardTitle>{service.name}</CardTitle>
												<CardDescription className='mt-1'>
													{getCategoryLabel(service.category)}
												</CardDescription>
											</div>
											<div className='flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm'>
												<Star className='h-3 w-3 fill-primary text-primary' />
												<span>{service.rating || "New"}</span>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<p className='text-sm text-muted-foreground mb-4'>
											{service.providerName || service.businessName}
										</p>
										<div className='grid grid-cols-2 gap-2 text-sm'>
											<div className='flex items-center gap-1 text-muted-foreground'>
												<Clock className='h-3 w-3' />
												<span>{service.duration} mins</span>
											</div>
											<div className='flex items-center gap-1 text-muted-foreground justify-end'>
												<span className='font-medium text-lg'>
													${service.price?.toFixed(2)}
												</span>
											</div>
										</div>
									</CardContent>
									<CardFooter className='flex justify-between'>
										<Button
											variant='ghost'
											size='sm'
											className='text-destructive'
											onClick={() =>
												handleRemoveFavorite("service", service.id)
											}
										>
											<Trash className='h-4 w-4 mr-2' />
											Remove
										</Button>
										<Link href={`/services/${service.id}`}>
											<Button size='sm'>View Details</Button>
										</Link>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent
					value='providers'
					className='space-y-6'
				>
					{filterFavorites(favoriteProviders).length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10 text-center'>
								<Heart className='h-10 w-10 text-muted-foreground mb-4' />
								{searchTerm ? (
									<>
										<p className='mb-2 text-lg font-medium'>
											No matching providers found
										</p>
										<p className='text-muted-foreground'>
											Try adjusting your search term
										</p>
									</>
								) : (
									<>
										<p className='mb-2 text-lg font-medium'>
											No favorite providers yet
										</p>
										<p className='text-muted-foreground mb-4'>
											Start adding providers to your favorites
										</p>
										<Link href='/services'>
											<Button>Browse Providers</Button>
										</Link>
									</>
								)}
							</CardContent>
						</Card>
					) : (
						<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
							{filterFavorites(favoriteProviders).map((provider) => (
								<Card key={provider.id}>
									<CardHeader>
										<div className='flex justify-between items-start'>
											<div>
												<CardTitle>
													{provider.businessName || provider.displayName}
												</CardTitle>
												<CardDescription className='mt-1'>
													{provider.displayName}
												</CardDescription>
											</div>
											<Badge variant='outline'>
												{getCategoryLabel(provider.category)}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className='flex justify-between items-center mb-4'>
											<div className='flex items-center'>
												<Star className='h-4 w-4 fill-yellow-400 text-yellow-400 mr-1' />
												<span className='font-medium'>
													{provider.rating || "New"}
												</span>
											</div>
											<span className='text-sm text-muted-foreground'>
												{provider.services || 0} services
											</span>
										</div>
										{provider.bio && (
											<p className='text-sm text-muted-foreground line-clamp-2'>
												{provider.bio}
											</p>
										)}
									</CardContent>
									<CardFooter className='flex justify-between'>
										<Button
											variant='ghost'
											size='sm'
											className='text-destructive'
											onClick={() =>
												handleRemoveFavorite("provider", provider.id)
											}
										>
											<Trash className='h-4 w-4 mr-2' />
											Remove
										</Button>
										<Link href={`/providers/${provider.id}`}>
											<Button size='sm'>View Profile</Button>
										</Link>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
