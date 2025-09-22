const ButtonSetter = [
	{
		name: "type",
		label: "按钮类型",
		type: "select",
		options: [
			{
				label: "主要按钮",
				value: "primary",
			},
			{
				label: "次要按钮",
				value: "default",
			},
			{
				label: "虚线按钮",
				value: "dashed",
			},
			{
				label: "文本按钮",
				value: "text",
			},
			{
				label: "链接按钮",
				value: "link",
			},
		],
	},
	{
		name: "text",
		label: "文本",
		type: "input",
	},
];

const ButtonStyleSetter = [
	{
		name: "width",
		label: "宽度",
		type: "input",
	},
	{
		name: "height",
		label: "高度",
		type: "input",
	},
];

export { ButtonSetter, ButtonStyleSetter };
