/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        netia: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#10B981',
        },
      },
    },
  },
  plugins: [],
}

