// 暂时注释掉中间件，以支持静态导出
// import { clerkMiddleware } from "@clerk/nextjs/server";
// 
// // 直接使用中间件
// export default clerkMiddleware();
// 
// export const config = {
// 	matcher: [
// 		// Skip Next.js internals and all static files, unless found in search params
// 		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// 		// Always run for API routes
// 		"/(api|trpc)(.*)",
// 	],
// };

// 添加空的中间件，以避免构建错误
export function middleware() {}
export const config = {
  matcher: []
};
