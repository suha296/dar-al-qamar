/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: '#F5F4F2', // very light gray
          light: '#FAF9F7',
        },
        header: {
          DEFAULT: '#E8E5DF', // soft beige/gray for header
        },
        accent: {
          DEFAULT: '#3A372E', // deep olive/dark brown for headings
        },
        text: {
          DEFAULT: '#222', // dark gray for body
          muted: '#666',
        },
        border: {
          DEFAULT: '#E0DED9', // subtle border color
        },
        button: {
          DEFAULT: '#E8E5DF', // match header for outlined buttons
          text: '#3A372E',
          border: '#CFCBC2',
        },
      },
    },
  },
  plugins: [],
} 