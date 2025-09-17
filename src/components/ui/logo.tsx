import Link from "next/link";
import React from "react";

interface LogoProps {
	className?: string;
	size?: "sm" | "md" | "lg";
	showText?: boolean;
	mode?: string;
}

const Logo: React.FC<LogoProps> = ({
	className = "",
	size = "md",
	showText = true,
	mode = "light",
}) => {
	const sizeClasses = {
		sm: "h-6 w-6",
		md: "h-8 w-8",
		lg: "h-10 w-10",
	};

	const textSizeClasses = {
		sm: "text-lg",
		md: "text-xl",
		lg: "text-2xl",
	};

	return (
		<Link href={"/"} aria-label="Cloud Builder Home">
			<div className={`flex items-center ${className} cursor-pointer`}>
				<div
					className={`${
						sizeClasses[size]
					} flex items-center justify-center rounded-full bg-${
						mode === "dark" ? "white" : "gray-800"
					} text-black`}
				>
					<span className="font-bold">⚡</span>
				</div>
				{showText && (
					<span
						className={`ml-2 ${textSizeClasses[size]} font-bold  text-${
							mode === "dark" ? "white" : "black"
						}`}
					>
						Cloud Builder
					</span>
				)}
			</div>
		</Link>
	);
};

export { Logo };
