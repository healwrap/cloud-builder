import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 确保图片优化正常工作
  images: {
    domains: ['img.clerk.com'], // Clerk的图片域名
  },
  
  // 支持 ES modules
  experimental: {
    esmExternals: true,
  },
  
  // 确保环境变量正确传递
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  },
  
  // 重定向配置 (可选)
  async redirects() {
    return [
      // 可以添加一些重定向规则
    ];
  },
};

export default nextConfig;
