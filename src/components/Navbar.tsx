"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
// import GradualBlurMemo from "./GradualBlur";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface NavItem {
	label: string;
	href: string;
}

export default function Navbar({
	logoUrl,
	items,
}: {
	logoUrl: string;
	items: NavItem[];
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav className="w-full fixed top-0 left-0 right-0 z-50">
			{/* <GradualBlurMemo
				className="!fixed top-0 z-0"
				target="parent"
				position="top"
				height="6rem"
				strength={2}
				divCount={5}
				curve="bezier"
				exponential={true}
				opacity={1}
			/> */}
			<div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10">
				{/* Logo */}
				<Link href="/" className="flex items-center">
					<Image src={logoUrl} alt="Logo" width={32} height={32} />
					<span className="ml-2 text-white font-bold text-xl">
						Cloud Builder
					</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-8">
					{items.map((item) => (
						<Link
							key={item.label}
							href={item.href}
							className="text-white hover:text-gray-300 transition-colors"
						>
							{item.label}
						</Link>
					))}

					{/* Auth Buttons */}
					<SignedOut>
						<SignInButton mode="modal">
							<button className="text-white hover:text-gray-300 cursor-pointer">登录</button>
						</SignInButton>
						<SignUpButton mode="modal">
							<button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
								注册
							</button>
						</SignUpButton>
					</SignedOut>
					<SignedIn>
						<Link
							href="/profile"
							className="text-white hover:text-gray-300 mr-4"
						>
							个人资料
						</Link>
						<UserButton afterSignOutUrl="/" />
					</SignedIn>
				</div>

				{/* Mobile Menu Button */}
				<button className="md:hidden text-white cursor-pointer" onClick={toggleMenu}>
					{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-black/80 backdrop-blur-lg z-10">
					<div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
						{items.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="text-white hover:text-gray-300 transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								{item.label}
							</Link>
						))}

						{/* Auth Buttons */}
						<SignedOut>
							<SignInButton mode="modal">
								<button className="text-white hover:text-gray-300 block w-full text-left cursor-pointer">
									登录
								</button>
							</SignInButton>
							<SignUpButton mode="modal">
								<button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full text-left cursor-pointer">
									注册
								</button>
							</SignUpButton>
						</SignedOut>
						<SignedIn>
							<Link
								href="/profile"
								className="text-white hover:text-gray-300"
								onClick={() => setIsMenuOpen(false)}
							>
								个人资料
							</Link>
							<div className="py-2">
								<UserButton afterSignOutUrl="/" />
							</div>
						</SignedIn>
					</div>
				</div>
			)}
		</nav>
	);
}
