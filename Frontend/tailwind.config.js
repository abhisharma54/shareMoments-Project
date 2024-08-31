/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'bgGradient-color': 'radial-gradient(at 52% 43%, hsl(136.71, 100%, 30%) 0, transparent 69%), radial-gradient(at 82% 65%, hsl(240.00, 10%, 13%) 0, transparent 55%);',
      },
      backgroundColor: {
        'bgColor': '#202020'
      },
      fontFamily: {
        'custom-font': '"Poppins", serif'
      },
      colors: {
        'custom-border': 'rgba(255,255,255,0.175)'
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-none': {
            'scrollbar-width': 'none',
          },
        },
        ['responsive', 'hover']
      );
    },
  ],
}

