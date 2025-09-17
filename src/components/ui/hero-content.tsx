import React from "react";

interface HeroContentProps {
  title?: string;
  description?: string;
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
  className?: string;
}

const HeroContent: React.FC<HeroContentProps> = ({
  title = "Unbeatable Pricing for Dynamic Email Tools",
  description = "Delivering unmatched email campaigns every day at unbeatable rates. Our tool redefines cost-effectiveness. Now!!!",
  primaryButton,
  secondaryButton,
  className = "container mx-auto mt-12 px-4 text-center"
}) => {
  const defaultPrimaryButton = (
    <button className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
      Start Your 7 Day Free Trial
    </button>
  );

  const defaultSecondaryButton = (
    <button className="h-12 rounded-full border border-gray-600 px-8 text-base font-medium text-white hover:bg-white/10">
      Watch Demo
    </button>
  );

  return (
    <div className={className}>
      <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
        {description}
      </p>
      <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        {primaryButton || defaultPrimaryButton}
        {secondaryButton || defaultSecondaryButton}
      </div>
    </div>
  );
};

export { HeroContent };