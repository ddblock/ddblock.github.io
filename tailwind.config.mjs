/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'blockchain': {
					'primary': '#2D3748',   // Dark blue-gray
					'secondary': '#4A5568', // Medium blue-gray
					'accent': '#4299E1',    // Bright blue
					'light': '#EDF2F7',     // Light gray
					'dark': '#1A202C',      // Very dark blue-gray
				},
			},
		},
	},
	plugins: [],
} 