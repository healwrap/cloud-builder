"use client";

import React, { useState } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";
import { MobileMenu } from "./mobile-menu";

interface AuthNavigationProps {
  navItems?: { label: string; hasDropdown?: boolean; href?: string }[];
  className?: string;
}

const AuthNavigation: React.FC<AuthNavigationProps> = ({
  navItems = [
    { label: "功能特性", hasDropdown: false },
  ],
  className = "container mx-auto flex items-center justify-between px-4 py-4 mt-6"
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  // 已登录用户的桌面端按钮
  const signedInDesktopButtons = (
    <div className="flex items-center space-x-4">
      <Link href="/dashboard">
        <button className="h-12 rounded-full border border-gray-600 px-8 text-base font-medium text-white hover:bg-white/10">
          进入控制台
        </button>
      </Link>
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
          },
        }}
      />
    </div>
  );

  // 未登录用户的桌面端按钮
  const signedOutDesktopButtons = (
    <div className="flex items-center space-x-3">
      <SignInButton mode="modal">
        <button className="h-12 rounded-full border border-gray-600 px-8 text-base font-medium text-white hover:bg-white/10">
          登录
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
          免费注册
        </button>
      </SignUpButton>
    </div>
  );

  // 已登录用户的移动端按钮
  const signedInMobileButtons = (
    <>
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
          <span className="text-white text-sm">
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
        </div>
        <Link href="/dashboard">
          <button className="w-full h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
            进入控制台
          </button>
        </Link>
      </div>
    </>
  );

  // 未登录用户的移动端按钮
  const signedOutMobileButtons = (
    <>
      <SignInButton mode="modal">
        <button className="w-full h-12 rounded-full border border-gray-700 text-white px-8 mb-4">
          登录
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="w-full h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
          免费注册
        </button>
      </SignUpButton>
    </>
  );

  return (
    <nav className={className}>
      <Logo />

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
        <div className="flex items-center space-x-3">
          <SignedOut>
            {signedOutDesktopButtons}
          </SignedOut>
          <SignedIn>
            {signedInDesktopButtons}
          </SignedIn>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        navItems={navItems}
        authButtons={
          <>
            <SignedOut>
              {signedOutMobileButtons}
            </SignedOut>
            <SignedIn>
              {signedInMobileButtons}
            </SignedIn>
          </>
        }
      />
    </nav>
  );
};

export { AuthNavigation };