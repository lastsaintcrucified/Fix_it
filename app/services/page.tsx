"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Star, Search, MapPin, Clock, Filter, X } from "lucide-react";
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
	type DocumentData,
	type Query,
	type QueryDocumentSnapshot,
	type FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose,
	SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// Define service categories
const serviceCategories = [
	{ value: "all", label: "All Categories" },
	{ value: "cleaning", label: "Cleaning" },
	{ value: "plumbing", label: "Plumbing" },
	{ value: "electrical", label: "Electrical" },
	{ value: "gardening", label: "Gardening" },
	{ value: "fitness", label: "Fitness" },
	{ value: "beauty", label: "Beauty & Spa" },
	{ value: "other", label: "Other" },
];

// Define sort options
const sortOptions = [
	{ value: "relevance", label: "Relevance" },
	{ value: "price_asc", label: "Price: Low to High" },
	{ value: "price_desc", label: "Price: High to Low" },
	{ value: "rating_desc", label: "Highest Rated" },
	{ value: "newest", label: "Newest" },
];

export default function ServicesPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get search parameters from URL
	const categoryParam = searchParams.get("category") || "all";
	const searchParam = searchParams.get("search") || "";
	const sortParam = searchParams.get("sort") || "relevance";
	const minPriceParam = searchParams.get("minPrice") || "0";
	const maxPriceParam = searchParams.get("maxPrice") || "5000";
	const minRatingParam = searchParams.get("minRating") || "0";

	// State for search and filters
	const [searchTerm, setSearchTerm] = useState(searchParam);
	const [category, setCategory] = useState(categoryParam);
	const [sortBy, setSortBy] = useState(sortParam);
	const [priceRange, setPriceRange] = useState<number[]>([
		Number.parseInt(minPriceParam),
		Number.parseInt(maxPriceParam),
	]);
	const [minRating, setMinRating] = useState(Number.parseInt(minRatingParam));
	const [durationFilters, setDurationFilters] = useState<string[]>([]);

	// State for services data
	const [services, setServices] = useState<DocumentData[]>([]);
	const [filteredServices, setFilteredServices] = useState<DocumentData[]>([]);
	const [loading, setLoading] = useState(true);
	const [lastVisible, setLastVisible] =
		useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeFilters, setActiveFilters] = useState<number>(0);

	// Fetch services on initial load and when category changes
	useEffect(() => {
		fetchServices();
	}, [category, sortBy]);

	// Apply client-side filtering when search term or filters change
	useEffect(() => {
		applyFilters();
	}, [services, searchTerm, priceRange, minRating, durationFilters]);

	// Count active filters for UI
	useEffect(() => {
		let count = 0;
		if (category !== "all") count++;
		if (searchTerm) count++;
		if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
		if (minRating > 0) count++;
		if (durationFilters.length > 0) count++;
		setActiveFilters(count);
	}, [category, searchTerm, priceRange, minRating, durationFilters]);

	// Function to fetch services from Firebase
	const fetchServices = async () => {
		setLoading(true);
		setError(null);

		try {
			const servicesRef = collection(db, "services");

			// Start with a basic query for active services
			let q: Query<DocumentData> = query(
				servicesRef,
				where("status", "==", "active")
			);

			// Apply category filter only if not "all"
			if (category !== "all") {
				q = query(q, where("category", "==", category));
			}

			// Apply sorting
			switch (sortBy) {
				case "price_asc":
					q = query(q, orderBy("price", "asc"));
					break;
				case "price_desc":
					q = query(q, orderBy("price", "desc"));
					break;
				case "rating_desc":
					q = query(q, orderBy("rating", "desc"));
					break;
				case "newest":
					q = query(q, orderBy("createdAt", "desc"));
					break;
				default:
					// For relevance or any other default sorting
					q = query(q, orderBy("createdAt", "desc"));
			}

			// Limit results
			q = query(q, limit(12));

			const querySnapshot = await getDocs(q);
			const servicesList: DocumentData[] = [];

			// Add debugging to check what's coming back
			console.log(`Found ${querySnapshot.size} services`);

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				console.log(
					`Service: ${data.name}, Category: ${data.category}, Status: ${data.status}`
				);
				servicesList.push({ id: doc.id, ...data });
			});

			setServices(servicesList);
			setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
			setHasMore(querySnapshot.docs.length === 12);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching services:", error);
			setError((error as FirestoreError).message || "Failed to load services");
			setLoading(false);
		}
	};

	// Function to apply client-side filters
	const applyFilters = () => {
		let filtered = [...services];

		// Apply search term filter
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(service) =>
					service.name.toLowerCase().includes(term) ||
					service.description.toLowerCase().includes(term) ||
					service.businessName.toLowerCase().includes(term)
			);
		}

		// Apply price range filter
		filtered = filtered.filter(
			(service) =>
				service.price >= priceRange[0] && service.price <= priceRange[1]
		);

		// Apply rating filter
		if (minRating > 0) {
			filtered = filtered.filter(
				(service) => (service.rating || 0) >= minRating
			);
		}

		// Apply duration filters
		if (durationFilters.length > 0) {
			filtered = filtered.filter((service) => {
				if (durationFilters.includes("short") && service.duration <= 60)
					return true;
				if (
					durationFilters.includes("medium") &&
					service.duration > 60 &&
					service.duration <= 120
				)
					return true;
				if (durationFilters.includes("long") && service.duration > 120)
					return true;
				return false;
			});
		}

		setFilteredServices(filtered);
	};

	// Function to load more services
	const loadMoreServices = async () => {
		if (!lastVisible) return;

		setLoading(true);

		try {
			const servicesRef = collection(db, "services");
			let q: Query<DocumentData> = query(
				servicesRef,
				where("status", "==", "active")
			);

			// Apply category filter
			if (category !== "all") {
				q = query(q, where("category", "==", category));
			}

			// Apply sorting
			switch (sortBy) {
				case "price_asc":
					q = query(q, orderBy("price", "asc"));
					break;
				case "price_desc":
					q = query(q, orderBy("price", "desc"));
					break;
				case "rating_desc":
					q = query(q, orderBy("rating", "desc"));
					break;
				case "newest":
					q = query(q, orderBy("createdAt", "desc"));
					break;
				default:
					q = query(q, orderBy("createdAt", "desc"));
			}

			// Start after last visible document and limit results
			q = query(q, startAfter(lastVisible), limit(12));

			const querySnapshot = await getDocs(q);
			const newServices: DocumentData[] = [];

			querySnapshot.forEach((doc) => {
				newServices.push({ id: doc.id, ...doc.data() });
			});

			setServices([...services, ...newServices]);
			setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
			setHasMore(querySnapshot.docs.length === 12);
			setLoading(false);
		} catch (error) {
			console.error("Error loading more services:", error);
			setError(
				(error as FirestoreError).message || "Failed to load more services"
			);
			setLoading(false);
		}
	};

	// Function to handle search form submission
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();

		// Update URL with search parameters
		const params = new URLSearchParams();
		if (searchTerm) params.set("search", searchTerm);
		if (category !== "all") params.set("category", category);
		if (sortBy !== "relevance") params.set("sort", sortBy);
		if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
		if (priceRange[1] < 1000) params.set("maxPrice", priceRange[1].toString());
		if (minRating > 0) params.set("minRating", minRating.toString());

		router.push(`/services?${params.toString()}`);
	};

	// Function to reset all filters
	const resetFilters = () => {
		setSearchTerm("");
		setCategory("all");
		setSortBy("relevance");
		setPriceRange([0, 1000]);
		setMinRating(0);
		setDurationFilters([]);

		router.push("/services");
	};

	// Function to handle duration filter changes
	const handleDurationFilterChange = (value: string) => {
		setDurationFilters((prev) => {
			if (prev.includes(value)) {
				return prev.filter((item) => item !== value);
			} else {
				return [...prev, value];
			}
		});
	};

	// Function to get category label from value
	const getCategoryLabel = (categoryValue: string) => {
		const category = serviceCategories.find(
			(cat) => cat.value === categoryValue
		);
		return category ? category.label : categoryValue;
	};

	return (
		<div className='flex min-h-screen flex-col'>
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container flex h-16 items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Shield className='h-6 w-6' />
						<span className='text-xl font-bold'>Fix-it</span>
					</div>
					<nav className='hidden md:flex items-center gap-6 text-sm'>
						<Link
							href='/'
							className='font-medium transition-colors hover:text-primary'
						>
							Home
						</Link>
						<Link
							href='/services'
							className='font-medium transition-colors text-primary'
						>
							Services
						</Link>
						<Link
							href='/about'
							className='font-medium transition-colors hover:text-primary'
						>
							About
						</Link>
						<Link
							href='/contact'
							className='font-medium transition-colors hover:text-primary'
						>
							Contact
						</Link>
					</nav>
					<div className='flex items-center gap-4'>
						<Link href='/login'>
							<Button
								variant='ghost'
								size='sm'
							>
								Log in
							</Button>
						</Link>
						<Link href='/signup'>
							<Button size='sm'>Sign up</Button>
						</Link>
					</div>
				</div>
			</header>

			<main className='flex-1'>
				<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center justify-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
									Find the Perfect Service Provider
								</h1>
								<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Browse through our extensive list of verified service
									providers
								</p>
							</div>
							<div className='w-full max-w-3xl space-y-2'>
								<form
									onSubmit={handleSearch}
									className='flex flex-col gap-2 sm:flex-row'
								>
									<div className='relative flex-1'>
										<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
										<Input
											placeholder='Search services...'
											className='w-full pl-9'
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>
									<Select
										value={category}
										onValueChange={setCategory}
									>
										<SelectTrigger className='w-full sm:w-[180px]'>
											<SelectValue placeholder='All Categories' />
										</SelectTrigger>
										<SelectContent>
											{serviceCategories.map((category) => (
												<SelectItem
													key={category.value}
													value={category.value}
												>
													{category.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										type='submit'
										className='w-full sm:w-auto'
									>
										Search
									</Button>
								</form>
							</div>
						</div>
					</div>
				</section>

				<section className='w-full py-12 md:py-24 lg:py-32'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col md:flex-row justify-between items-start gap-6'>
							{/* Mobile Filter Button */}
							<div className='w-full flex justify-between items-center md:hidden mb-4'>
								<h2 className='text-2xl font-bold'>
									{category !== "all" ? getCategoryLabel(category) : "All"}{" "}
									Services
								</h2>
								<Sheet>
									<SheetTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											className='flex items-center gap-2'
										>
											<Filter className='h-4 w-4' />
											Filters
											{activeFilters > 0 && (
												<Badge
													variant='secondary'
													className='ml-1'
												>
													{activeFilters}
												</Badge>
											)}
										</Button>
									</SheetTrigger>
									<SheetContent
										side='right'
										className='w-[300px] sm:w-[400px]'
									>
										<SheetHeader>
											<SheetTitle>Filters</SheetTitle>
											<SheetDescription>
												Refine your search with these filters
											</SheetDescription>
										</SheetHeader>
										<div className='py-4 space-y-6'>
											<div className='space-y-2'>
												<h3 className='text-sm font-medium'>Category</h3>
												<Select
													value={category}
													onValueChange={setCategory}
												>
													<SelectTrigger>
														<SelectValue placeholder='Select category' />
													</SelectTrigger>
													<SelectContent>
														{serviceCategories.map((category) => (
															<SelectItem
																key={category.value}
																value={category.value}
															>
																{category.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div className='space-y-2'>
												<h3 className='text-sm font-medium'>Sort By</h3>
												<Select
													value={sortBy}
													onValueChange={setSortBy}
												>
													<SelectTrigger>
														<SelectValue placeholder='Sort by' />
													</SelectTrigger>
													<SelectContent>
														{sortOptions.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div className='space-y-4'>
												<div className='flex justify-between items-center'>
													<h3 className='text-sm font-medium'>Price Range</h3>
													<span className='text-sm text-muted-foreground'>
														${priceRange[0]} - ${priceRange[1]}
													</span>
												</div>
												<Slider
													defaultValue={priceRange}
													min={0}
													max={1000}
													step={10}
													value={priceRange}
													onValueChange={setPriceRange}
													className='py-4'
												/>
											</div>

											<div className='space-y-2'>
												<h3 className='text-sm font-medium'>Minimum Rating</h3>
												<div className='flex items-center gap-2'>
													{[0, 1, 2, 3, 4, 5].map((rating) => (
														<Button
															key={rating}
															variant={
																minRating === rating ? "default" : "outline"
															}
															size='sm'
															onClick={() => setMinRating(rating)}
															className='flex items-center gap-1'
														>
															{rating > 0 ? (
																<>
																	{rating}
																	<Star className='h-3 w-3 fill-current' />
																</>
															) : (
																"Any"
															)}
														</Button>
													))}
												</div>
											</div>

											<div className='space-y-2'>
												<h3 className='text-sm font-medium'>Duration</h3>
												<div className='space-y-2'>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='short-mobile'
															checked={durationFilters.includes("short")}
															onCheckedChange={() =>
																handleDurationFilterChange("short")
															}
														/>
														<label
															htmlFor='short-mobile'
															className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
														>
															Short (up to 1 hour)
														</label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='medium-mobile'
															checked={durationFilters.includes("medium")}
															onCheckedChange={() =>
																handleDurationFilterChange("medium")
															}
														/>
														<label
															htmlFor='medium-mobile'
															className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
														>
															Medium (1-2 hours)
														</label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='long-mobile'
															checked={durationFilters.includes("long")}
															onCheckedChange={() =>
																handleDurationFilterChange("long")
															}
														/>
														<label
															htmlFor='long-mobile'
															className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
														>
															Long (2+ hours)
														</label>
													</div>
												</div>
											</div>
										</div>
										<SheetFooter className='flex flex-row justify-between'>
											<Button
												variant='outline'
												onClick={resetFilters}
											>
												Reset Filters
											</Button>
											<SheetClose asChild>
												<Button
													type='submit'
													onClick={handleSearch}
												>
													Apply Filters
												</Button>
											</SheetClose>
										</SheetFooter>
									</SheetContent>
								</Sheet>
							</div>

							{/* Desktop Sidebar Filters */}
							<div className='hidden md:block w-64 sticky top-24'>
								<div className='space-y-6'>
									<div className='flex justify-between items-center'>
										<h3 className='text-lg font-semibold'>Filters</h3>
										{activeFilters > 0 && (
											<Button
												variant='ghost'
												size='sm'
												onClick={resetFilters}
												className='h-8 px-2'
											>
												<X className='h-4 w-4 mr-1' />
												Clear all
											</Button>
										)}
									</div>

									<Accordion
										type='single'
										collapsible
										defaultValue='category'
										className='w-full'
									>
										<AccordionItem value='category'>
											<AccordionTrigger className='text-sm font-medium'>
												Category
											</AccordionTrigger>
											<AccordionContent>
												<div className='space-y-1 pt-1'>
													{serviceCategories.map((cat) => (
														<Button
															key={cat.value}
															variant={
																category === cat.value ? "default" : "ghost"
															}
															size='sm'
															className='w-full justify-start text-sm h-8'
															onClick={() => setCategory(cat.value)}
														>
															{cat.label}
														</Button>
													))}
												</div>
											</AccordionContent>
										</AccordionItem>

										<AccordionItem value='sort'>
											<AccordionTrigger className='text-sm font-medium'>
												Sort By
											</AccordionTrigger>
											<AccordionContent>
												<div className='space-y-1 pt-1'>
													{sortOptions.map((option) => (
														<Button
															key={option.value}
															variant={
																sortBy === option.value ? "default" : "ghost"
															}
															size='sm'
															className='w-full justify-start text-sm h-8'
															onClick={() => setSortBy(option.value)}
														>
															{option.label}
														</Button>
													))}
												</div>
											</AccordionContent>
										</AccordionItem>

										<AccordionItem value='price'>
											<AccordionTrigger className='text-sm font-medium'>
												Price Range
											</AccordionTrigger>
											<AccordionContent>
												<div className='space-y-4 pt-2'>
													<div className='flex justify-between items-center'>
														<span className='text-sm'>${priceRange[0]}</span>
														<span className='text-sm'>${priceRange[1]}</span>
													</div>
													<Slider
														defaultValue={priceRange}
														min={0}
														max={1000}
														step={10}
														value={priceRange}
														onValueChange={setPriceRange}
													/>
												</div>
											</AccordionContent>
										</AccordionItem>

										<AccordionItem value='rating'>
											<AccordionTrigger className='text-sm font-medium'>
												Minimum Rating
											</AccordionTrigger>
											<AccordionContent>
												<div className='grid grid-cols-3 gap-2 pt-2'>
													{[0, 1, 2, 3, 4, 5].map((rating) => (
														<Button
															key={rating}
															variant={
																minRating === rating ? "default" : "outline"
															}
															size='sm'
															onClick={() => setMinRating(rating)}
															className='flex items-center gap-1'
														>
															{rating > 0 ? (
																<>
																	{rating}
																	<Star className='h-3 w-3 fill-current' />
																</>
															) : (
																"Any"
															)}
														</Button>
													))}
												</div>
											</AccordionContent>
										</AccordionItem>

										<AccordionItem value='duration'>
											<AccordionTrigger className='text-sm font-medium'>
												Duration
											</AccordionTrigger>
											<AccordionContent>
												<div className='space-y-2 pt-2'>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='short'
															checked={durationFilters.includes("short")}
															onCheckedChange={() =>
																handleDurationFilterChange("short")
															}
														/>
														<label
															htmlFor='short'
															className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
														>
															Short (up to 1 hour)
														</label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='medium'
															checked={durationFilters.includes("medium")}
															onCheckedChange={() =>
																handleDurationFilterChange("medium")
															}
														/>
														<label
															htmlFor='medium'
															className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
														>
															Medium (1-2 hours)
														</label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='long'
															checked={durationFilters.includes("long")}
															onCheckedChange={() =>
																handleDurationFilterChange("long")
															}
														/>
														<label
															htmlFor='long'
															className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
														>
															Long (2+ hours)
														</label>
													</div>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>

									<Button
										className='w-full'
										onClick={handleSearch}
									>
										Apply Filters
									</Button>
								</div>
							</div>

							{/* Services Grid */}
							<div className='flex-1'>
								<div className='hidden md:flex justify-between items-center mb-6'>
									<h2 className='text-2xl font-bold'>
										{category !== "all" ? getCategoryLabel(category) : "All"}{" "}
										Services
									</h2>
									<div className='flex items-center gap-2'>
										<p className='text-sm text-muted-foreground'>
											{filteredServices.length} services found
										</p>
										<Select
											value={sortBy}
											onValueChange={setSortBy}
										>
											<SelectTrigger className='w-[180px]'>
												<SelectValue placeholder='Sort by' />
											</SelectTrigger>
											<SelectContent>
												{sortOptions.map((option) => (
													<SelectItem
														key={option.value}
														value={option.value}
													>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Active Filters Display */}
								{activeFilters > 0 && (
									<div className='flex flex-wrap gap-2 mb-4'>
										{category !== "all" && (
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												Category: {getCategoryLabel(category)}
												<Button
													variant='ghost'
													size='icon'
													className='h-4 w-4 p-0 ml-1'
													onClick={() => setCategory("all")}
												>
													<X className='h-3 w-3' />
													<span className='sr-only'>Remove filter</span>
												</Button>
											</Badge>
										)}

										{searchTerm && (
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												Search: {searchTerm}
												<Button
													variant='ghost'
													size='icon'
													className='h-4 w-4 p-0 ml-1'
													onClick={() => setSearchTerm("")}
												>
													<X className='h-3 w-3' />
													<span className='sr-only'>Remove filter</span>
												</Button>
											</Badge>
										)}

										{(priceRange[0] > 0 || priceRange[1] < 1000) && (
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												Price: ${priceRange[0]} - ${priceRange[1]}
												<Button
													variant='ghost'
													size='icon'
													className='h-4 w-4 p-0 ml-1'
													onClick={() => setPriceRange([0, 1000])}
												>
													<X className='h-3 w-3' />
													<span className='sr-only'>Remove filter</span>
												</Button>
											</Badge>
										)}

										{minRating > 0 && (
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												Rating: {minRating}+{" "}
												<Star className='h-3 w-3 fill-current' />
												<Button
													variant='ghost'
													size='icon'
													className='h-4 w-4 p-0 ml-1'
													onClick={() => setMinRating(0)}
												>
													<X className='h-3 w-3' />
													<span className='sr-only'>Remove filter</span>
												</Button>
											</Badge>
										)}

										{durationFilters.length > 0 && (
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												Duration:{" "}
												{durationFilters
													.map((d) => d.charAt(0).toUpperCase() + d.slice(1))
													.join(", ")}
												<Button
													variant='ghost'
													size='icon'
													className='h-4 w-4 p-0 ml-1'
													onClick={() => setDurationFilters([])}
												>
													<X className='h-3 w-3' />
													<span className='sr-only'>Remove filter</span>
												</Button>
											</Badge>
										)}

										<Button
											variant='ghost'
											size='sm'
											onClick={resetFilters}
											className='h-7 px-2'
										>
											Clear all filters
										</Button>
									</div>
								)}

								{error ? (
									<div className='flex justify-center py-12'>
										<p className='text-destructive'>{error}</p>
									</div>
								) : loading && filteredServices.length === 0 ? (
									<div className='flex justify-center py-12'>
										<p>Loading services...</p>
									</div>
								) : filteredServices.length === 0 ? (
									<div className='flex flex-col items-center justify-center py-12 space-y-4'>
										<p>No services found matching your criteria.</p>
										<Button
											variant='outline'
											onClick={resetFilters}
										>
											Reset Filters
										</Button>
									</div>
								) : (
									<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
										{filteredServices.map((service) => (
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
													<p className='text-sm text-muted-foreground line-clamp-2 mb-4'>
														{service.description}
													</p>
													<div className='grid grid-cols-2 gap-2 text-sm'>
														<div className='flex items-center gap-1 text-muted-foreground'>
															<MapPin className='h-3 w-3' />
															<span>
																{service.businessName || service.providerName}
															</span>
														</div>
														<div className='flex items-center gap-1 text-muted-foreground'>
															<Clock className='h-3 w-3' />
															<span>{service.duration} mins</span>
														</div>
														<div className='col-span-2 mt-2'>
															<p className='font-medium text-lg'>
																${service.price.toFixed(2)}
															</p>
														</div>
													</div>
												</CardContent>
												<CardFooter>
													<Link
														href={`/services/${service.id}`}
														className='w-full'
													>
														<Button className='w-full'>View Details</Button>
													</Link>
												</CardFooter>
											</Card>
										))}
									</div>
								)}

								{hasMore && filteredServices.length > 0 && (
									<div className='flex justify-center mt-8'>
										<Button
											onClick={loadMoreServices}
											variant='outline'
											disabled={loading}
										>
											{loading ? "Loading..." : "Load More"}
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className='w-full border-t bg-background py-6'>
				<div className='container flex flex-col items-center justify-between gap-4 md:flex-row'>
					<div className='flex items-center gap-2'>
						<Shield className='h-6 w-6' />
						<span className='text-lg font-bold'>Fix-it</span>
					</div>
					<p className='text-sm text-muted-foreground'>
						© {new Date().getFullYear()} Fix-it. All rights reserved.
					</p>
					<div className='flex gap-4'>
						<Link
							href='/terms'
							className='text-sm text-muted-foreground hover:text-foreground'
						>
							Terms
						</Link>
						<Link
							href='/privacy'
							className='text-sm text-muted-foreground hover:text-foreground'
						>
							Privacy
						</Link>
						<Link
							href='/contact'
							className='text-sm text-muted-foreground hover:text-foreground'
						>
							Contact
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
