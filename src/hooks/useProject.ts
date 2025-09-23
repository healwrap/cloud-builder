import { useState, useEffect, useCallback } from "react";
import {
	Project,
	CreateProjectInput,
	UpdateProjectInput,
} from "@/types/project";
import ProjectDB from "@/lib/indexedDB";
import { useRouter } from "next/navigation";
import { App } from "antd";

/**
 * 项目管理 Hook
 */
export function useProject() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(false);
	const [creating, setCreating] = useState(false);
	const router = useRouter();
	const { message } = App.useApp();

	/**
	 * 加载项目列表
	 */
	const loadProjects = useCallback(async () => {
		setLoading(true);
		try {
			const projectList = await ProjectDB.getAllProjects();
			setProjects(projectList);
		} catch (error) {
			console.error("加载项目列表失败:", error);
			message.error("加载项目列表失败");
		} finally {
			setLoading(false);
		}
	}, [message]);

	/**
	 * 创建新项目
	 */
	const createProject = useCallback(
		async (input: CreateProjectInput) => {
			setCreating(true);
			try {
				const newProject = await ProjectDB.createProject(input);
				setProjects((prev) => [newProject, ...prev]);
				message.success("项目创建成功");
				return newProject;
			} catch (error) {
				console.error("创建项目失败:", error);
				message.error("创建项目失败");
				return null;
			} finally {
				setCreating(false);
			}
		},
		[message]
	);

	/**
	 * 删除项目
	 */
	const deleteProject = useCallback(
		async (id: string) => {
			try {
				const success = await ProjectDB.deleteProject(id);
				if (success) {
					setProjects((prev) => prev.filter((p) => p.id !== id));
					message.success("项目删除成功");
					return true;
				} else {
					message.error("删除项目失败");
					return false;
				}
			} catch (error) {
				console.error("删除项目失败:", error);
				message.error("删除项目失败");
				return false;
			}
		},
		[message]
	);

	/**
	 * 更新项目
	 */
	const updateProject = useCallback(
		async (id: string, updates: UpdateProjectInput) => {
			try {
				const success = await ProjectDB.updateProject(id, updates);
				if (success) {
					await loadProjects(); // 重新加载列表
					message.success("项目更新成功");
					return true;
				} else {
					message.error("更新项目失败");
					return false;
				}
			} catch (error) {
				console.error("更新项目失败:", error);
				message.error("更新项目失败");
				return false;
			}
		},
		[loadProjects, message]
	);

	/**
	 * 跳转到编辑器
	 */
	const openEditor = useCallback(
		(projectId?: string) => {
			if (projectId) {
				router.push(`/editor?projectId=${projectId}`);
			} else {
				router.push("/editor");
			}
		},
		[router]
	);

	/**
	 * 创建项目并跳转到编辑器
	 */
	const createAndOpenEditor = useCallback(
		async (input: CreateProjectInput) => {
			const project = await createProject(input);
			if (project) {
				openEditor(project.id);
			}
		},
		[createProject, openEditor]
	);

	/**
	 * 搜索项目
	 */
	const searchProjects = useCallback(
		async (keyword: string) => {
			setLoading(true);
			try {
				if (!keyword.trim()) {
					await loadProjects();
					return;
				}
				const results = await ProjectDB.searchProjects(keyword);
				setProjects(results);
			} catch (error) {
				console.error("搜索项目失败:", error);
				message.error("搜索项目失败");
			} finally {
				setLoading(false);
			}
		},
		[loadProjects, message]
	);

	/**
	 * 获取单个项目
	 */
	const getProject = useCallback(
		async (id: string): Promise<Project | null> => {
			try {
				const project = await ProjectDB.getProjectById(id);
				return project || null;
			} catch (error) {
				console.error("获取项目失败:", error);
				return null;
			}
		},
		[]
	);

	// 组件挂载时加载项目列表
	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	return {
		// 数据
		projects,
		loading,
		creating,

		// 操作方法
		loadProjects,
		createProject,
		deleteProject,
		updateProject,
		searchProjects,
		getProject,

		// 导航方法
		openEditor,
		createAndOpenEditor,
	};
}

/**
 * 单个项目数据管理 Hook（用于编辑器页面）
 */
export function useProjectData(projectId?: string) {
	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const { message } = App.useApp();

	/**
	 * 加载项目数据
	 */
	const loadProject = useCallback(
		async (id: string) => {
			setLoading(true);
			try {
				const projectData = await ProjectDB.getProjectById(id);
				setProject(projectData || null);
				if (!projectData) {
					message.error("项目不存在");
				}
			} catch (error) {
				console.error("加载项目失败:", error);
				message.error("加载项目失败");
			} finally {
				setLoading(false);
			}
		},
		[message]
	);

	/**
	 * 保存项目组件数据
	 */
	const saveProject = useCallback(
		async (components: Project["components"]) => {
			if (!project?.id) return false;

			setSaving(true);
			try {
				const success = await ProjectDB.saveProjectComponents(
					project.id,
					components
				);
				if (success) {
					setProject((prev) =>
						prev ? { ...prev, components, updatedAt: new Date() } : null
					);
					message.success("项目保存成功");
					return true;
				} else {
					message.error("保存项目失败");
					return false;
				}
			} catch (error) {
				console.error("保存项目失败:", error);
				message.error("保存项目失败");
				return false;
			} finally {
				setSaving(false);
			}
		},
		[project?.id, message]
	);

	/**
	 * 更新项目缩略图
	 */
	const updateThumbnail = useCallback(
		async (thumbnail: string) => {
			if (!project?.id) return false;

			try {
				const success = await ProjectDB.updateProjectThumbnail(
					project.id,
					thumbnail
				);
				if (success) {
					setProject((prev) =>
						prev ? { ...prev, thumbnail, updatedAt: new Date() } : null
					);
					return true;
				}
				return false;
			} catch (error) {
				console.error("更新缩略图失败:", error);
				return false;
			}
		},
		[project?.id]
	);

	// 当 projectId 变化时加载项目
	useEffect(() => {
		if (projectId) {
			loadProject(projectId);
		} else {
			setProject(null);
		}
	}, [projectId, loadProject]);

	return {
		// 数据
		project,
		loading,
		saving,

		// 操作方法
		loadProject,
		saveProject,
		updateThumbnail,
	};
}
