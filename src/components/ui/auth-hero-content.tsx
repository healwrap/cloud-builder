"use client";

import React from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

interface AuthHeroContentProps {
  title?: string;
  description?: string;
  className?: string;
}

const AuthHeroContent: React.FC<AuthHeroContentProps> = ({
  title = "云构 Cloud Builder",
  description = "现代化低代码平台，让每个人都能轻松构建应用。拖拽式设计，无需编程经验即可创建精美的应用界面。",
  className = "container mx-auto mt-12 px-4 text-center"
}) => {
  return (
    <div className={className}>
      <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
        {description}
      </p>
      
      <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <SignedOut>
          {/* 未登录时显示注册和登录按钮 */}
          <SignUpButton mode="modal">
            <button className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
              免费开始使用
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="h-12 rounded-full border border-gray-600 px-8 text-base font-medium text-white hover:bg-white/10">
              登录账户
            </button>
          </SignInButton>
        </SignedOut>
        
        <SignedIn>
          {/* 已登录时显示进入控制台和查看演示按钮 */}
          <Link href="/dashboard">
            <button className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
              进入控制台
            </button>
          </Link>
          <button className="h-12 rounded-full border border-gray-600 px-8 text-base font-medium text-white hover:bg-white/10">
            查看演示
          </button>
        </SignedIn>
      </div>
    </div>
  );
};

export { AuthHeroContent };