/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        background: '#f7f7f7',
        text: {
          DEFAULT: '#333',
          light: '#555',
        },
        heading: '#222',
        link: {
          DEFAULT: '#0066cc',
          hover: '#004999',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 5px 20px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'DEFAULT': '0.375rem',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // This enables dark mode with the 'dark' class
}
