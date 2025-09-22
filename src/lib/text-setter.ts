const TextType = [
	{ label: "标题一", value: "h1" },
	{ label: "标题二", value: "h2" },
	{ label: "标题三", value: "h3" },
	{ label: "标题四", value: "h4" },
	{ label: "标题五", value: "h5" },
	{ label: "标题六", value: "h6" },
	{ label: "正文", value: "p" },
];

const TextSetter = [
	{
		type: "select",
		name: "type",
		label: "文本类型",
		options: TextType,
	},
	{
		type: "input",
		name: "text",
		label: "文本内容",
	},
];

const TextStyleSetter = [];

export { TextSetter, TextStyleSetter, TextType };
