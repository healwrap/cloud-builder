"use client";

import React from "react";
import GradientBlinds from "@/components/GradientBlinds";
import BlurText from "@/components/BlurText";
import MagicBento from "@/components/MagicBento";
import Navbar from "@/components/Navbar";
import { StaggeredMenu } from "@/components/StaggeredMenu";

export default function Home() {
	return (
		<div className="min-h-screen w-full relative overflow-x-hidden bg-black z-0">
			<div className="h-screen">
				{/* 导航栏 */}
				<Navbar
					logoUrl="/vercel.svg"
					items={[
						{ label: "首页", href: "/" },
						{ label: "功能", href: "/features" },
						{ label: "文档", href: "/docs" },
						{ label: "关于", href: "/about" },
					]}
				/>
				{/* 全屏背景动画 */}
				<GradientBlinds
					className="!absolute top-0  inset-0 w-full h-screen z-0"
					gradientColors={["#B19EEF", "#5227FF", "#FF9FFC"]}
					blindCount={20}
					noise={0.4}
					mouseDampening={0.2}
				/>
				{/* 主要内容 */}
				<div className="absolute top-0 h-screen w-full flex items-center justify-center pointer-events-none">
					{/* 中央标题区域 - 全屏高度 */}
					<div className="px-4">
						<div className="text-center">
							<BlurText
								text="云构 Cloud Builder"
								className="text-6xl md:text-8xl font-bold text-white mb-8"
								animateBy="words"
								delay={300}
								direction="top"
							/>

							{/* 按钮组 */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto">
								<button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
									快速开始
								</button>
								<button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300">
									在线演示
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* <StaggeredMenu
					className="pointer-events-none"
					position="right"
					logoUrl="/vercel.svg"
					colors={["#B19EEF", "#5227FF", "#FF9FFC"]}
					items={[
						{ label: "首页", ariaLabel: "首页", link: "/" },
						{ label: "功能", ariaLabel: "功能介绍", link: "/features" },
						{ label: "文档", ariaLabel: "文档", link: "/docs" },
						{ label: "关于", ariaLabel: "关于我们", link: "/about" },
					]}
					displaySocials={false}
					displayItemNumbering={true}
					menuButtonColor="#fff"
					openMenuButtonColor="#000"
					accentColor="#5227FF"
					changeMenuColorOnOpen={true}
				/> */}
			</div>

			{/* 功能介绍区域 - 独立section */}
			<section className="h-screen z-10 py-20 px-4">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
						平台核心功能
					</h2>
					<div className="w-full flex justify-center">
						<MagicBento
							cards={[
								{
									color: "#060010",
									title: "可视化界面设计器",
									description: "拖拽式设计，无需编程经验即可创建精美界面",
									label: "设计工具",
								},
								{
									color: "#060010",
									title: "上手容易",
									description: "直观的用户界面，快速上手，节省学习时间",
									label: "用户友好",
								},
								{
									color: "#060010",
									title: "丰富的组件库",
									description: "提供数百个预制组件，满足各种业务需求",
									label: "组件生态",
								},
								{
									color: "#060010",
									title: "一键部署",
									description: "快速发布到云端，支持多种部署环境",
									label: "部署服务",
								},
								{
									color: "#060010",
									title: "多端支持",
									description: "自动适配移动端、桌面端，响应式设计",
									label: "跨平台",
								},
								{
									color: "#060010",
									title: "扩展性强",
									description: "支持自定义插件和脚本，满足复杂业务需求",
									label: "高度可定制",
								},
							]}
							enableStars={true}
							enableSpotlight={true}
							enableBorderGlow={true}
							enableTilt={false}
							clickEffect={true}
							enableMagnetism={false}
							glowColor="132, 0, 255"
							spotlightRadius={300}
							particleCount={10}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
