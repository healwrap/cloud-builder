import { Component } from "@/stores/component";

/**
 * 项目数据结构定义
 */
export interface Project {
	/** 项目唯一标识符 */
	id: string;
	
	/** 项目名称 */
	name: string;
	
	/** 项目描述 */
	description: string;
	
	/** 创建时间 */
	createdAt: Date;
	
	/** 最后更新时间 */
	updatedAt: Date;
	
	/** 项目缩略图 (base64 格式) */
	thumbnail?: string;
	
	/** 组件树数据 */
	components: Component[];
	
	/** 项目设置 */
	settings?: {
		/** 页面标题 */
		title?: string;
		/** 页面描述 */
		description?: string;
		/** 是否发布 */
		published?: boolean;
	};
}

/**
 * 创建项目时的输入参数
 */
export interface CreateProjectInput {
	name: string;
	description?: string;
}

/**
 * 更新项目时的输入参数
 */
export interface UpdateProjectInput {
	name?: string;
	description?: string;
	components?: Component[];
	thumbnail?: string;
	settings?: Project["settings"];
}