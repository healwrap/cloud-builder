"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SSOCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// 获取重定向URL参数 - 支持新旧两种参数格式
		const afterSignInUrl = searchParams.get("after_sign_in_url");
		const afterSignUpUrl = searchParams.get("after_sign_up_url");
		const redirectUrl = searchParams.get("redirect_url");

		// 这里可以添加认证状态检查逻辑
		// 例如检查是否有认证token或session

		// 优先使用新格式的 redirect_url，然后是 after_sign_up_url，最后是 after_sign_in_url
		const finalRedirectUrl =
			redirectUrl || afterSignUpUrl || afterSignInUrl || "/dashboard";

		// 解码URL（因为URL参数是编码的）
		const decodedUrl = decodeURIComponent(finalRedirectUrl);

		// 延迟一点时间以显示加载状态
		const timer = setTimeout(() => {
			router.push(decodedUrl);
		}, 1000);

		return () => clearTimeout(timer);
	}, [router, searchParams]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
				<h2 className="text-xl font-semibold text-black mb-2">
					正在处理认证...
				</h2>
				<p className="text-gray-600">稍后将自动跳转到您的目标页面</p>
			</div>
		</div>
	);
}

export default function SSOCallbackPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
						<p className="text-gray-600">加载中...</p>
					</div>
				</div>
			}
		>
			<SSOCallbackContent />
		</Suspense>
	);
}
