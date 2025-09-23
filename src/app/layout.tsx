import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { App } from "antd";
import "./globals.css";
import "allotment/dist/style.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "云构 Cloud Builder - 低代码平台",
	description: "基于Next.js的现代化低代码平台，让每个人都能轻松构建应用",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider 
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
			signInFallbackRedirectUrl="/dashboard"
			signUpFallbackRedirectUrl="/dashboard"
		>
			<html lang="zh-CN">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<App>
						{children}
					</App>
				</body>
			</html>
		</ClerkProvider>
	);
}
