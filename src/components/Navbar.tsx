import React from "react";
// 注释掉未使用的导入
// import { Menu, X } from "lucide-react";
// import Image from "next/image";
import GradualBlurMemo from "./GradualBlur";

interface NavItem {
	label: string;
	href: string;
}

export default function Navbar({
	// 注释掉未使用的参数
	// logoUrl,
	// items,
}: {
	logoUrl: string;
	items: NavItem[];
}) {
	// 注释掉未使用的状态
	// const [isMenuOpen, setIsMenuOpen] = useState(false);

	// 注释掉未使用的函数
	// const toggleMenu = () => {
	// 	setIsMenuOpen(!isMenuOpen);
	// };

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
