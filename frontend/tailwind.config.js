/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cesar: '#3B82F6',
        ximena: '#EC4899',
        karla: '#10B981',
        felipe: '#F59E0B',
        stefania: '#8B5CF6',
      },
    },
  },
  plugins: [],
}
