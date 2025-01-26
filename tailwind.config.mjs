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
			typography: {
				DEFAULT: {
					css: {
						'h1, h2, h3, h4': {
							color: '#2D3748',
							fontWeight: '700',
						},
						a: {
							color: '#4299E1',
							textDecoration: 'none',
							'&:hover': {
								color: '#2D3748',
								textDecoration: 'underline',
							},
						},
						ul: {
							listStyleType: 'disc',
						},
						ol: {
							listStyleType: 'decimal',
						},
						'ul, ol': {
							paddingLeft: '1.5em',
						},
						'li': {
							marginTop: '0.5em',
							marginBottom: '0.5em',
						},
						blockquote: {
							borderLeftColor: '#4299E1',
							color: '#4A5568',
						},
						code: {
							color: '#2D3748',
							backgroundColor: '#EDF2F7',
							padding: '0.2em 0.4em',
							borderRadius: '0.25em',
						},
					},
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
} 