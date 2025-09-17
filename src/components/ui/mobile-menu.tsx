"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./logo";
import { MobileNavItem } from "./mobile-nav-item";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  navItems?: { label: string; href?: string }[];
  authButtons?: React.ReactNode;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onToggle,
  navItems = [
    { label: "Use Cases", href: "/use-cases" },
    { label: "Products", href: "/products" },
    { label: "Resources", href: "/resources" },
    { label: "Pricing", href: "/pricing" },
  ],
  authButtons
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden"
        onClick={onToggle}
      >
        <span className="sr-only">Toggle menu</span>
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile Navigation Menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col p-4 bg-black/95 md:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={onToggle}>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="mt-8 flex flex-col space-y-6">
              {navItems.map((item) => (
                <MobileNavItem key={item.label} label={item.label} href={item.href} />
              ))}
              <div className="pt-4 space-y-4">
                {authButtons}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { MobileMenu };