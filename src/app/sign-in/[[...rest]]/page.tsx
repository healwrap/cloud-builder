"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") || "/dashboard";

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="w-full max-w-md">
				<SignIn
					appearance={{
						elements: {
							formButtonPrimary:
								"bg-blue-500 hover:bg-blue-600 text-sm normal-case",
							card: "rounded-xl shadow-md",
							headerTitle: "text-xl font-bold text-gray-800",
							headerSubtitle: "text-gray-500",
						},
					}}
				/>
			</div>
		</div>
	);
}
