"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";
import { MobileMenu } from "./mobile-menu";

interface NavigationProps {
	navItems?: { label: string; hasDropdown?: boolean; href?: string }[];
	className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
	navItems = [{ label: "功能特性", hasDropdown: false }],
	className = "container mx-auto flex items-center justify-between px-4 py-4 mt-6",
}) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// 桌面端按钮
	const desktopButtons = (
		<div className="flex items-center space-x-3">
			<Link href="/sign-in">
				<button className="h-12 rounded-full border border-gray-600 px-8 text-base font-medium text-white hover:bg-white/10">
					登录
				</button>
			</Link>
			<Link href="/sign-up">
				<button className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
					免费注册
				</button>
			</Link>
		</div>
	);

	// 移动端按钮
	const mobileButtons = (
		<>
			<Link href="/sign-in">
				<button className="w-full h-12 rounded-full border border-gray-700 text-white px-8 mb-4">
					登录
				</button>
			</Link>
			<Link href="/sign-up">
				<button className="w-full h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
					免费注册
				</button>
			</Link>
		</>
	);

	return (
		<nav className={className}>
			<Logo mode="dark" />

			{/* Desktop Navigation */}
			<div className="hidden md:flex items-center space-x-6">
				<div className="flex items-center space-x-6">
					{navItems.map((item) => (
						<NavItem
							key={item.label}
							label={item.label}
							hasDropdown={item.hasDropdown}
							href={item.href}
						/>
					))}
				</div>
				<div className="flex items-center space-x-3">{desktopButtons}</div>
			</div>

			{/* Mobile Menu */}
			<MobileMenu
				isOpen={mobileMenuOpen}
				onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
				navItems={navItems}
				authButtons={mobileButtons}
			/>
		</nav>
	);
};

export { Navigation };
