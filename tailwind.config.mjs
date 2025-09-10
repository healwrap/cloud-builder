/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [],
};

export default config;
