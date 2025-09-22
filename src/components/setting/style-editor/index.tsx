import { parseCSS, stylesToCSS } from "@/lib/utils";
import useComponentStore from "@/stores/component";
import useComponentConfigStore, {
	ComponentSetter,
} from "@/stores/component-config";
import { Editor } from "@monaco-editor/react";
import {
	Form,
	Input,
	InputNumber,
	Select,
	ColorPicker,
	Divider,
	Modal,
	Button,
} from "antd";
import type { SelectProps } from "antd";
import React, { useEffect, useState } from "react";
import { CSSProperties } from "react";

// 处理表单值转换的工具函数
function processFormValue(value: unknown): string | number | null {
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

// 渲染表单元素
function renderFormElement(setter: ComponentSetter) {
	const { type, options } = setter;

	switch (type) {
		case "select":
			return <Select options={options as SelectProps["options"]} allowClear />;
		case "input":
			return <Input allowClear />;
		case "inputNumber":
			return <InputNumber />;
		case "colorPicker":
			return <ColorPicker format="hex" showText allowClear />;
		default:
			return <Input allowClear />;
	}
}

export default function StyleEditor() {
	const [form] = Form.useForm();
	const { componentConfig } = useComponentConfigStore();
	const { activeComponent, updateComponent } = useComponentStore();
	const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
	const [cssCode, setCssCode] = useState("");

	const componentType = activeComponent?.name;
	const currentConfig = componentType ? componentConfig[componentType] : null;

	// 修复表单值切换问题 + CSS编辑器同步
	useEffect(() => {
		if (activeComponent && currentConfig) {
			// 获取当前组件配置支持的所有样式字段
			const supportedStyleFields =
				currentConfig.styleSetter?.map((setter) => setter.name) || [];

			// 创建完整的表单值对象，包含基本信息和样式
			const formValues: Record<string, unknown> = {};

			// 为所有支持的样式字段设置值（如果组件有该样式）或设置为 undefined（清空字段）
			supportedStyleFields.forEach((field) => {
				formValues[field] =
					activeComponent.styles?.[field as keyof CSSProperties] || undefined;
			});

			form.setFieldsValue(formValues);

			// 同步CSS编辑器的值
			setCssCode(stylesToCSS(activeComponent.styles || {}));
		} else {
			form.resetFields();
			setCssCode(stylesToCSS({}));
		}
	}, [activeComponent, currentConfig, form]);

	const handleValuesChange = (changedValues: Record<string, unknown>) => {
		if (!activeComponent) return;

		// 过滤并处理样式值
		const styleUpdates: Record<string, string | number | null> = {};

		Object.entries(changedValues).forEach(([key, value]) => {
			styleUpdates[key] = processFormValue(value);
		});

		// 只有当有样式变化时才更新
		if (Object.keys(styleUpdates).length > 0) {
			updateComponent(activeComponent.id, {
				styles: styleUpdates as CSSProperties,
			});
		}
	};

	// 处理CSS编辑器的变化
	const handleCSSChange = (value: string | undefined) => {
		if (!value || !activeComponent) return;

		setCssCode(value);

		try {
			const parsedStyles = parseCSS(value);
			updateComponent(activeComponent.id, {
				styles: parsedStyles,
			});

			// 同步表单值
			const formValues: Record<string, unknown> = {};
			const supportedStyleFields =
				currentConfig?.styleSetter?.map((setter) => setter.name) || [];

			supportedStyleFields.forEach((field) => {
				formValues[field] =
					parsedStyles[field as keyof CSSProperties] || undefined;
			});

			form.setFieldsValue(formValues);
		} catch (error) {
			console.error("CSS parsing failed:", error);
		}
	};

	if (!activeComponent) {
		return <div className="p-4 text-gray-500">请选择一个组件</div>;
	}

	function setModal(open: boolean) {
		if (open) {
			setCssCode(stylesToCSS(activeComponent?.styles || {}));
		}
		setIsEditorModalOpen(open);
	}

	return (
		<div className="my-4 h-full overflow-auto">
			<Form
				form={form}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 14 }}
				onValuesChange={handleValuesChange}
			>
				{currentConfig?.styleSetter?.map((item) => (
					<Form.Item key={item.name} label={item.label} name={item.name}>
						{renderFormElement(item)}
					</Form.Item>
				))}
			</Form>
			<Divider>样式编辑器</Divider>
			<div className="h-40 flex justify-center">
				<Button type="primary" onClick={() => setModal(true)}>
					打开样式编辑器
				</Button>
			</div>
			<Modal
				title="样式编辑器"
				open={isEditorModalOpen}
				onCancel={() => setModal(false)}
				footer={null}
				width="80%"
				style={{ top: 20 }}
			>
				<div className="h-[600px]">
					<Editor
						className="overflow-auto w-full"
						language="css"
						theme="vs-dark"
						value={cssCode}
						onChange={handleCSSChange}
						options={{
							minimap: { enabled: false },
							scrollBeyondLastLine: false,
							wordWrap: "on",
							fontSize: 14,
							lineNumbers: "on",
							folding: true,
							automaticLayout: true,
						}}
					/>
				</div>
			</Modal>
		</div>
	);
}
