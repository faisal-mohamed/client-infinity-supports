import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#627d98',
          500: '#334e68',
          600: '#1a3a5c',
          700: '#002344',
          800: '#001a33',
          900: '#001122',
        },
        gold: {
          50: '#fdfcf0',
          100: '#faf6d4',
          200: '#f2eba3',
          300: '#e6da6e',
          400: '#d9c94f',
          500: '#cab741',
          600: '#b5a339',
          700: '#968730',
          800: '#7a6d2a',
          900: '#655a26',
        },
        azure: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#627d98',
          500: '#334e68',
          600: '#1a3a5c',
          700: '#002344',
          800: '#001a33',
          900: '#001122',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 35 68 / 0.05)',
        'soft': '0 1px 3px 0 rgb(0 35 68 / 0.06), 0 1px 2px -1px rgb(0 35 68 / 0.06)',
        'card': '0 2px 8px -2px rgb(0 35 68 / 0.08), 0 2px 4px -2px rgb(0 35 68 / 0.04)',
        'elevated': '0 8px 24px -4px rgb(0 35 68 / 0.12), 0 4px 8px -2px rgb(0 35 68 / 0.06)',
        'glow': '0 0 20px rgb(202 183 65 / 0.15)',
        'gold': '0 4px 14px -2px rgb(202 183 65 / 0.25)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #002344 0%, #003366 100%)',
        'gradient-gold': 'linear-gradient(135deg, #cab741 0%, #e6da6e 100%)',
        'gradient-hero': 'linear-gradient(135deg, #002344 0%, #001a33 50%, #002344 100%)',
      },
    },
  },
  plugins: [],
}
export default config
