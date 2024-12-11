/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-orange': '#FF4500',
        'terminal-green': '#00FF00',
        'terminal-red': '#FF0000',
      },
      animation: {
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 500ms infinite',
      },
      fontFamily: {
        'mono': ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}