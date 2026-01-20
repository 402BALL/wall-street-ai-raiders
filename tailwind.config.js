/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'win95': {
          'gray': '#c0c0c0',
          'dark': '#808080',
          'light': '#dfdfdf',
          'blue': '#000080',
          'cyan': '#008080',
          'white': '#ffffff',
          'black': '#000000',
        },
        'terminal': {
          'green': '#00ff00',
          'amber': '#ffb000',
          'cyan': '#00ffff',
          'red': '#ff0000',
          'yellow': '#ffff00',
          'bg': '#000000',
        }
      },
      fontFamily: {
        'dos': ['Fixedsys', 'Consolas', 'monospace'],
        'win95': ['MS Sans Serif', 'Tahoma', 'sans-serif'],
        'terminal': ['IBM Plex Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}

