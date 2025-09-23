import React from "react";
import { Button, Space, App } from "antd";
import { SaveOutlined, HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Component } from "@/stores/component";

interface EditorHeaderProps {
	projectName?: string;
	projectId?: string | null;
	components?: Component[];
	saveProject?: (components: Component[]) => Promise<boolean>;
}

export default function EditorHeader({
	projectName,
	projectId,
	components,
	saveProject,
}: EditorHeaderProps) {
	const router = useRouter();
	const { message } = App.useApp();

	const handleSave = async () => {
		if (!projectId || !components || !saveProject) {
			message.warning("无法保存：缺少项目信息");
			return;
		}

		try {
			const success = await saveProject(components);
			if (success) {
				message.success("项目保存成功");
			} else {
				message.error("项目保存失败");
			}
		} catch (error) {
			console.error("保存失败:", error);
			message.error("项目保存失败");
		}
	};

	const handleBackToDashboard = () => {
		router.push("/dashboard");
	};

	return (
		<header className="p-1 px-6 border-b border-gray-300 bg-gray-100 flex items-center justify-between space-x-4">
			<div className="flex items-center space-x-4">
				<h1 className="text-xl">云构 Cloud Builder</h1>
				{projectName && (
					<span className="text-gray-600 text-sm">- {projectName}</span>
				)}
			</div>
			<Space>
				<Button
					icon={<SaveOutlined />}
					onClick={handleSave}
					disabled={!projectId}
				>
					保存
				</Button>
				<Button icon={<HomeOutlined />} onClick={handleBackToDashboard}>
					返回
				</Button>
				<Button type="primary">部署</Button>
			</Space>
		</header>
	);
}
