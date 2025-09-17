"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";

export default function DashboardPage() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<div className="text-white">加载中...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black">
			{/* Header */}
			<header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Logo mode="dark" />
						<div className="flex items-center space-x-4">
							<span className="text-gray-300">
								欢迎回来,{" "}
								{user?.firstName || user?.emailAddresses[0]?.emailAddress}
							</span>
							<UserButton
								appearance={{
									elements: {
										avatarBox: "w-10 h-10",
									},
								}}
							/>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-white mb-4">云构 Dashboard</h1>
					<p className="text-gray-300 text-lg">
						欢迎使用低代码平台，这里是您的控制中心
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-2">我的项目</h3>
						<p className="text-3xl font-bold text-purple-400">0</p>
						<p className="text-gray-400 text-sm">个活跃项目</p>
					</div>

					<div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-2">组件库</h3>
						<p className="text-3xl font-bold text-blue-400">50+</p>
						<p className="text-gray-400 text-sm">可用组件</p>
					</div>

					<div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
						<h3 className="text-lg font-semibold text-white mb-2">模板库</h3>
						<p className="text-3xl font-bold text-green-400">20+</p>
						<p className="text-gray-400 text-sm">预制模板</p>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
					<h2 className="text-xl font-semibold text-white mb-4">快速开始</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<button className="text-left p-4 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors">
							<div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
								<span className="text-xl">🚀</span>
							</div>
							<h3 className="text-white font-medium mb-1">创建新项目</h3>
							<p className="text-gray-400 text-sm">从零开始构建应用</p>
						</button>

						<button className="text-left p-4 border border-gray-600 rounded-lg hover:border-blue-500 transition-colors">
							<div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
								<span className="text-xl">📋</span>
							</div>
							<h3 className="text-white font-medium mb-1">选择模板</h3>
							<p className="text-gray-400 text-sm">使用预制模板快速开始</p>
						</button>

						<button className="text-left p-4 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
							<div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
								<span className="text-xl">📚</span>
							</div>
							<h3 className="text-white font-medium mb-1">查看文档</h3>
							<p className="text-gray-400 text-sm">学习平台使用方法</p>
						</button>
					</div>
				</div>

				{/* User Info (Debug) */}
				<div className="mt-8 bg-gray-900/30 border border-gray-700 rounded-lg p-6">
					<h2 className="text-lg font-semibold text-white mb-4">
						用户信息 (调试)
					</h2>
					<div className="text-gray-300 space-y-2">
						<p>
							<strong>用户ID:</strong> {user?.id}
						</p>
						<p>
							<strong>邮箱:</strong> {user?.emailAddresses[0]?.emailAddress}
						</p>
						<p>
							<strong>姓名:</strong> {user?.firstName} {user?.lastName}
						</p>
						<p>
							<strong>创建时间:</strong> {user?.createdAt?.toLocaleDateString()}
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
