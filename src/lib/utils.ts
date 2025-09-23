import { clsx, type ClassValue } from "clsx";
import { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * 递归根据id查找对象
 * @param object 传入的对象数组
 * @param id 查找的id
 * @returns 查找到的对象
 */
export function getObjectById<T extends { id: string }>(
	object: T[],
	id: string
): T | undefined {
	if (!id) return undefined;
	for (const obj of object) {
		if (obj.id === id) {
			return obj;
		}
		if ("children" in obj) {
			const children = obj.children;
			if (!Array.isArray(children)) continue;
			const found = getObjectById(children, id);
			if (found) return found;
		}
	}
	return undefined;
}
// CSS样式对象转换为CSS代码
export function stylesToCSS(styles: CSSProperties): string {
	if (!styles || Object.keys(styles).length === 0) {
		return ".comp {\n  /* 在这里编写CSS样式 */\n}";
	}

	const cssRules = Object.entries(styles)
		.map(([key, value]) => {
			if (value === null || value === undefined) return null;
			// 将驼峰命名转为短横线命名（CSS格式）
			const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			return `  ${cssKey}: ${value};`;
		})
		.filter(Boolean)
		.join("\n");

	return `.comp {\n${cssRules}\n}`;
}

// CSS代码解析为样式对象
export function parseCSS(cssCode: string): CSSProperties {
	const styles: CSSProperties = {};

	try {
		// 提取.comp选择器内的样式规则 - 支持多行匹配
		const match = cssCode.match(/\.comp\s*\{([^}]*)\}/);
		if (!match) return styles;

		const cssRules = match[1];

		// 更精确的CSS声明解析：使用正则表达式匹配属性:值对
		const declarationRegex = /([a-zA-Z-]+)\s*:\s*([^;]+)(?:;|$)/g;
		let declarationMatch;

		while ((declarationMatch = declarationRegex.exec(cssRules)) !== null) {
			const property = declarationMatch[1].trim();
			const value = declarationMatch[2].trim();

			if (property && value) {
				// 将短横线命名转为驼峰命名（React style对象格式）
				const jsKey = property.replace(/-([a-z])/g, (_, letter) =>
					letter.toUpperCase()
				);

				// 处理值 - 移除可能的引号
				let processedValue: string | number = value.replace(/^['"]|['"]$/g, "");

				// 如果是纯数字，转换为数字类型
				if (/^\d+$/.test(processedValue)) {
					processedValue = parseInt(processedValue, 10);
				} else if (/^\d+\.?\d*px$/.test(processedValue)) {
					// 保持像素值为字符串格式
					processedValue = processedValue;
				}

				// 使用对象赋值，后面的属性会覆盖前面的重复属性
				(styles as Record<string, unknown>)[jsKey] = processedValue;
			}
		}
	} catch (error) {
		console.error("CSS parsing error:", error);
	}

	return styles;
}

// 处理表单值转换的工具函数
export function processFormValue(value: unknown): string | number | null {
	// 空值处理
	if (value === null || value === undefined || value === "") {
		return null;
	}

	// 基本类型直接返回
	if (typeof value === "string" || typeof value === "number") {
		return value;
	}

	// 颜色对象处理
	if (value && typeof value === "object") {
		const colorObj = value as Record<string, unknown>;
		if (
			"toHexString" in colorObj &&
			typeof colorObj.toHexString === "function"
		) {
			return (colorObj.toHexString as () => string)();
		}
		if ("hex" in colorObj && typeof colorObj.hex === "string") {
			return colorObj.hex;
		}
		// 其他对象转换为字符串
		const stringValue = String(value);
		return stringValue === "undefined" || stringValue === "null"
			? null
			: stringValue;
	}

	return null;
}