import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#f9d7ac',
          300: '#f5b977',
          400: '#f09140',
          500: '#ec7419',
          600: '#dd5a0f',
          700: '#b7430f',
          800: '#923614',
          900: '#762f14',
          950: '#401508',
        },
        tunisia: {
          red: '#E70013',
          sand: '#C4A35A',
          blue: '#0077B6',
          cream: '#FFF8E7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
