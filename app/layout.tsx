import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Fix-it - Connect with Service Providers",
	description: "Book services from trusted professionals in your area",
	generator: "lastSaint",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
		>
			<body className={inter.className}>
				<AuthProvider>
					<ThemeProvider>
						<ThemeToggle />
						{children}
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
