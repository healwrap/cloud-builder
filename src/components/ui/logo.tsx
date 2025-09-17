import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = "md", 
  showText = true,
  textColor = "text-white"
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Link href={"/"} aria-label="Cloud Builder Home">
      <div className={`flex items-center ${className} cursor-pointer`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-white text-black`}>
        <span className="font-bold">⚡</span>
      </div>
      {showText && (
        <span className={`ml-2 ${textSizeClasses[size]} font-bold ${textColor}`}>
          Cloud Builder
        </span>
      )}
    </div>
    </Link>
  );
};

export { Logo };