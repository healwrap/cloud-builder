import React from "react";
import { ArrowRight } from "lucide-react";

interface BadgeProps {
  text?: string;
  className?: string;
  showIcon?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  text = "Join the revolution today!", 
  className = "mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm",
  showIcon = true
}) => {
  return (
    <div className={className}>
      <span className="text-sm font-medium text-white">
        {text}
      </span>
      {showIcon && <ArrowRight className="h-4 w-4 text-white" />}
    </div>
  );
};

export { Badge };