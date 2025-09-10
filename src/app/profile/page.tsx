"use client";

import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Profile() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <SignedIn>
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-xl p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">个人资料</h1>
          <div className="mb-8">
            <UserButton afterSignOutUrl="/" />
          </div>
          <p className="text-center mb-4">您已成功登录！这是您的个人资料页面。</p>
          <Link href="/" className="text-blue-400 hover:underline">
            返回首页
          </Link>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-xl p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">请登录</h1>
          <SignIn redirectUrl="/profile" />
        </div>
      </SignedOut>
    </div>
  );
}
