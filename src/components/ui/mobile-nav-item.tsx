import React from "react";
import { ArrowRight } from "lucide-react";

interface MobileNavItemProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ label, href, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (href) {
      // 这里可以处理路由跳转
      console.log(`Navigate to: ${href}`);
    }
  };

  return (
    <div 
      className="flex items-center justify-between border-b border-gray-800 pb-2 text-lg text-white cursor-pointer"
      onClick={handleClick}
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 text-gray-400" />
    </div>
  );
};

export { MobileNavItem };