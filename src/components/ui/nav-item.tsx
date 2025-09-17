import React from "react";

interface NavItemProps {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  label, 
  hasDropdown = false, 
  onClick,
  href,
  className = "flex items-center text-sm text-gray-300 hover:text-white cursor-pointer"
}) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (href) {
      // 这里可以处理路由跳转
      console.log(`Navigate to: ${href}`);
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      <span>{label}</span>
      {hasDropdown && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </div>
  );
};

export { NavItem };