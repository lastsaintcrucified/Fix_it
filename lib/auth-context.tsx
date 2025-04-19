"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import {
	type User,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

type UserRole = "client" | "provider" | "admin";

interface UserData {
	uid: string;
	email: string | null;
	displayName: string | null;
	role: UserRole;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createdAt: any;
	businessName?: string;
}

interface AuthContextType {
	user: User | null;
	userData: UserData | null;
	loading: boolean;
	signup: (
		email: string,
		password: string,
		displayName: string,
		role: UserRole,
		businessName?: string
	) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setUser(user);

			if (user) {
				// Fetch additional user data from Firestore
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);

				if (userDoc.exists()) {
					setUserData(userDoc.data() as UserData);
				}
			} else {
				setUserData(null);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const signup = async (
		email: string,
		password: string,
		displayName: string,
		role: UserRole,
		businessName?: string
	) => {
		try {
			// Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Update profile with display name
			await updateProfile(user, { displayName });

			// Create user document in Firestore
			const userData: UserData = {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				role,
				createdAt: serverTimestamp(),
				...(businessName && { businessName }),
			};

			await setDoc(doc(db, "users", user.uid), userData);

			setUserData(userData);
		} catch (error) {
			console.error("Error signing up:", error);
			throw error;
		}
	};

	const login = async (email: string, password: string) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			console.error("Error logging in:", error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error logging out:", error);
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, userData, loading, signup, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
