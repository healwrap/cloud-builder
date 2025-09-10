import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import GradualBlurMemo from "./GradualBlur";

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
		<nav className="w-full">

			<GradualBlurMemo
				className="!fixed top-0 z-0"
				target="parent"
				position="top"
				height="6rem"
				strength={2}
				divCount={5}
				curve="bezier"
				exponential={true}
				opacity={1}
			/>
		</nav>
	);
}
