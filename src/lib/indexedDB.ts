import Dexie, { Table } from "dexie";
import {
	Project,
	CreateProjectInput,
	UpdateProjectInput,
} from "@/types/project";
import { nanoid } from "nanoid";

/**
 * 云构项目数据库类
 */
class CloudBuilderDB extends Dexie {
	projects!: Table<Project, string>;

	constructor() {
		super("CloudBuilderDB");

		// 定义数据库架构
		this.version(1).stores({
			projects: "id, name, createdAt, updatedAt, published",
		});
	}
}

// 创建数据库实例
const db = new CloudBuilderDB();

/**
 * 项目数据库操作类
 */
export class ProjectDB {
	/**
	 * 创建新项目
	 */
	static async createProject(input: CreateProjectInput): Promise<Project> {
		const now = new Date();
		const project: Project = {
			id: nanoid(10),
			name: input.name,
			description: input.description || "",
			createdAt: now,
			updatedAt: now,
			components: [
				{
					id: nanoid(10),
					name: "Page",
					props: {},
					desc: "页面",
					styles: {},
				},
			],
			settings: {
				title: input.name,
				description: input.description || "",
				published: false,
			},
		};

		await db.projects.add(project);
		return project;
	}

	/**
	 * 获取所有项目
	 */
	static async getAllProjects(): Promise<Project[]> {
		try {
			return await db.projects.orderBy("updatedAt").reverse().toArray();
		} catch (error) {
			console.error("获取项目列表失败:", error);
			return [];
		}
	}

	/**
	 * 根据ID获取项目
	 */
	static async getProjectById(id: string): Promise<Project | undefined> {
		try {
			return await db.projects.get(id);
		} catch (error) {
			console.error("获取项目失败:", error);
			return undefined;
		}
	}

	/**
	 * 更新项目
	 */
	static async updateProject(
		id: string,
		updates: UpdateProjectInput
	): Promise<boolean> {
		try {
			// 先获取项目，再更新
			const project = await db.projects.get(id);
			if (!project) return false;

			// 手动更新字段
			if (updates.name !== undefined) project.name = updates.name;
			if (updates.description !== undefined)
				project.description = updates.description;
			if (updates.components !== undefined)
				project.components = updates.components;
			if (updates.thumbnail !== undefined)
				project.thumbnail = updates.thumbnail;
			if (updates.settings !== undefined) project.settings = updates.settings;

			project.updatedAt = new Date();

			// 保存更新后的项目
			await db.projects.put(project);
			return true;
		} catch (error) {
			console.error("更新项目失败:", error);
			return false;
		}
	}

	/**
	 * 删除项目
	 */
	static async deleteProject(id: string): Promise<boolean> {
		try {
			await db.projects.delete(id);
			return true;
		} catch (error) {
			console.error("删除项目失败:", error);
			return false;
		}
	}

	/**
	 * 保存项目组件数据（用于编辑器保存）
	 */
	static async saveProjectComponents(
		id: string,
		components: Project["components"]
	): Promise<boolean> {
		try {
			// 先获取项目，再更新组件
			const project = await db.projects.get(id);
			if (!project) return false;

			project.components = components;
			project.updatedAt = new Date();

			await db.projects.put(project);
			return true;
		} catch (error) {
			console.error("保存项目组件失败:", error);
			return false;
		}
	}

	/**
	 * 更新项目缩略图
	 */
	static async updateProjectThumbnail(
		id: string,
		thumbnail: string
	): Promise<boolean> {
		try {
			// 先获取项目，再更新缩略图
			const project = await db.projects.get(id);
			if (!project) return false;

			project.thumbnail = thumbnail;
			project.updatedAt = new Date();

			await db.projects.put(project);
			return true;
		} catch (error) {
			console.error("更新项目缩略图失败:", error);
			return false;
		}
	}

	/**
	 * 搜索项目（按名称）
	 */
	static async searchProjects(keyword: string): Promise<Project[]> {
		try {
			return await db.projects
				.filter(
					(project) =>
						project.name.toLowerCase().includes(keyword.toLowerCase()) ||
						project.description.toLowerCase().includes(keyword.toLowerCase())
				)
				.toArray();
		} catch (error) {
			console.error("搜索项目失败:", error);
			return [];
		}
	}

	/**
	 * 获取项目数量
	 */
	static async getProjectCount(): Promise<number> {
		try {
			return await db.projects.count();
		} catch (error) {
			console.error("获取项目数量失败:", error);
			return 0;
		}
	}

	/**
	 * 清空所有项目（开发调试用）
	 */
	static async clearAllProjects(): Promise<boolean> {
		try {
			await db.projects.clear();
			return true;
		} catch (error) {
			console.error("清空项目失败:", error);
			return false;
		}
	}
}

// 导出数据库实例（如果需要直接操作）
export { db };
export default ProjectDB;
