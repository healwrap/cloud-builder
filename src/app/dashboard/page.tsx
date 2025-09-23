"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import { useProject } from "@/hooks/useProject";
import { useState } from "react";
import Image from "next/image";
import {
	Button,
	Modal,
	Input,
	Popconfirm,
	Space,
	Typography,
	Empty,
	Spin,
} from "antd";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface ProjectCardProps {
	project?: {
		id: string;
		name: string;
		description: string;
		updatedAt: Date;
		thumbnail?: string;
	};
	onEdit?: () => void;
	onDelete?: () => void;
	onCreate?: () => void;
}

function ProjectCard({
	project,
	onEdit,
	onDelete,
	onCreate,
}: ProjectCardProps) {
	if (!project) {
		// 新建项目卡片
		return (
			<div
				className="group h-80 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-all duration-200 cursor-pointer bg-white hover:bg-gray-50"
				onClick={onCreate}
			>
				<div className="h-full flex flex-col items-center justify-center p-6 text-center">
					<div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors duration-200">
						<PlusOutlined className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
					</div>
					<Title
						level={4}
						className="text-gray-700 mb-2 group-hover:text-gray-900 transition-colors duration-200"
					>
						新建项目
					</Title>
					<Paragraph className="text-gray-500 mb-0 text-sm">
						点击创建一个新的低代码项目
					</Paragraph>
				</div>
			</div>
		);
	}

	return (
		<div className="group h-80 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden cursor-pointer">
			{/* 项目预览/缩略图区域 */}
			<div
				className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
				onClick={onEdit}
			>
				{project.thumbnail ? (
					<Image
						src={project.thumbnail}
						alt={project.name}
						fill
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center">
							<EyeOutlined className="text-2xl text-gray-500" />
						</div>
					</div>
				)}
			</div>

			{/* 项目信息区域 */}
			<div className="py-2 px-4 flex-1 flex flex-col">
				<div className="flex-1">
					<div className="flex items-start justify-between mb-1">
						<Title
							level={5}
							ellipsis
							className="flex-1 mt-1! mb-0! text-gray-900"
						>
							{project.name}
						</Title>
						<Popconfirm
							title="确定要删除这个项目吗？"
							description="删除后无法恢复，请谨慎操作。"
							onConfirm={onDelete}
							okText="确定"
							cancelText="取消"
							placement="topRight"
						>
							<Button
								type="text"
								size="small"
								icon={<DeleteOutlined />}
								className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
								danger
								onClick={(e) => e.stopPropagation()}
							/>
						</Popconfirm>
					</div>
					<Paragraph
						ellipsis={{ rows: 2 }}
						className="text-gray-600 text-sm leading-relaxed mb-1!"
					>
						{project.description || "暂无描述"}
					</Paragraph>
				</div>

				{/* 底部信息 */}
				<div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
					<span>更新于 {new Date(project.updatedAt).toLocaleDateString()}</span>
					<div className="flex items-center space-x-1">
						<span className="w-2 h-2 bg-green-400 rounded-full"></span>
						<span>已保存</span>
					</div>
				</div>
			</div>
		</div>
	);
}

interface ProjectListProps {
	projects: Array<{
		id: string;
		name: string;
		description: string;
		updatedAt: Date;
		thumbnail?: string;
	}>;
	loading: boolean;
	onCreateProject: () => void;
	onEditProject: (projectId: string) => void;
	onDeleteProject: (projectId: string) => void;
}

function ProjectList({
	projects,
	loading,
	onCreateProject,
	onEditProject,
	onDeleteProject,
}: ProjectListProps) {
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Spin size="large" />
			</div>
		);
	}

	if (projects.length === 0) {
		return (
			<div className="text-center py-20">
				<Empty
					description={
						<span className="text-gray-500">
							还没有任何项目，开始创建您的第一个低代码项目吧！
						</span>
					}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						size="large"
						onClick={onCreateProject}
					>
						创建第一个项目
					</Button>
				</Empty>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
			{/* 新建项目卡片 */}
			<ProjectCard onCreate={onCreateProject} />

			{/* 项目列表 */}
			{projects.map((project) => (
				<ProjectCard
					key={project.id}
					project={project}
					onEdit={() => onEditProject(project.id)}
					onDelete={() => onDeleteProject(project.id)}
				/>
			))}
		</div>
	);
}

export default function DashboardPage() {
	const { user, isLoaded } = useUser();
	const {
		projects,
		loading,
		creating,
		createAndOpenEditor,
		openEditor,
		deleteProject,
	} = useProject();

	const [showCreateModal, setShowCreateModal] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");

	const handleCreateProject = async () => {
		if (!projectName.trim()) return;

		await createAndOpenEditor({
			name: projectName.trim(),
			description: projectDescription.trim(),
		});

		// 重置表单
		setProjectName("");
		setProjectDescription("");
		setShowCreateModal(false);
	};

	const handleEditProject = (projectId: string) => {
		openEditor(projectId);
	};

	const handleDeleteProject = async (projectId: string) => {
		await deleteProject(projectId);
	};

	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="border-b border-gray-200 bg-white/90 backdrop-blur-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Logo mode="light" />
						<div className="flex items-center space-x-4">
							<span className="text-gray-600">
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
			<main className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Welcome Section */}
				<div className="mb-12">
					<Title level={1} className="mb-4 text-gray-900">
						云构 Dashboard
					</Title>
					<Paragraph className="text-lg text-gray-600">
						欢迎使用低代码平台，这里是您的控制中心
					</Paragraph>
				</div>

				{/* 项目管理区域 */}
				<div className="mb-6">
					<div className="flex justify-between items-center mb-8">
						<Title level={2} className="mb-0 text-gray-800">
							我的项目
						</Title>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							size="large"
							onClick={() => setShowCreateModal(true)}
						>
							新建项目
						</Button>
					</div>

					<ProjectList
						projects={projects}
						loading={loading}
						onCreateProject={() => setShowCreateModal(true)}
						onEditProject={handleEditProject}
						onDeleteProject={handleDeleteProject}
					/>
				</div>
			</main>

			{/* 创建项目模态框 */}
			<Modal
				title={
					<div className="flex items-center">
						<PlusOutlined className="mr-2" />
						创建新项目
					</div>
				}
				open={showCreateModal}
				onOk={handleCreateProject}
				onCancel={() => {
					setShowCreateModal(false);
					setProjectName("");
					setProjectDescription("");
				}}
				confirmLoading={creating}
				okText="创建并打开编辑器"
				cancelText="取消"
				width={520}
				centered
			>
				<div className="py-4">
					<Space direction="vertical" className="w-full" size="large">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								项目名称 <span className="text-red-500">*</span>
							</label>
							<Input
								placeholder="请输入项目名称"
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								onPressEnter={handleCreateProject}
								size="large"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								项目描述
							</label>
							<Input.TextArea
								placeholder="请输入项目描述（可选）"
								value={projectDescription}
								onChange={(e) => setProjectDescription(e.target.value)}
								rows={4}
								size="large"
							/>
						</div>
					</Space>
				</div>
			</Modal>
		</div>
	);
}
