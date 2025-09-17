import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义公开路由（不需要登录即可访问）
const isPublicRoute = createRouteMatcher([
  '/',           // 首页
  '/sign-in(.*)', // 登录页面及其子路由
  '/sign-up(.*)', // 注册页面及其子路由
  '/api/webhooks(.*)', // Webhook API路由（如果需要）
]);

export default clerkMiddleware(async (auth, req) => {
  // 如果不是公开路由，则需要登录验证
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
