/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'granja-gold': '#FFD700', // Gold color
        'granja-black': '#1A1A1A', // Dark background color
        'granja-dark-gray': '#2A2A2A', // Slightly lighter dark for cards/elements
        'granja-light-gold': '#FFEC8B', // Lighter gold for text
        'granja-accent-gold': '#DAA520', // A more subdued gold for borders/accents
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
