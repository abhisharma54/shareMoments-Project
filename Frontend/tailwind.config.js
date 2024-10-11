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
        'bgHeader-color': 'radial-gradient(at 42% 100%, hsl(136.71, 100%, 15%) 0, transparent 45%), radial-gradient(at 82% 65%, hsl(240.00, 10%, 17%) 0, transparent 25%);',
        'bgNavbar-color': 'radial-gradient(at 70% 33%, hsl(136.71, 100%, 30%) 0,transparent 59%),radial-gradient(at 0% 55%, hsl(140, 51%, 16%) 0, transparent 55%);',
        'bgHomeLogged-color': 'radial-gradient(at 42% 33%, hsl(136.71, 100%, 30%) 0, transparent 59%), radial-gradient(at 82% 65%, hsl(240.00, 10%, 13%) 0, transparent 55%);',
        'bgHomeLoggedIn-color': 'radial-gradient(at 46% 33%, hsl(136.71, 100%, 40%) 0,transparent 69%), radial-gradient(at 82% 65%, hsl(240, 10%, 13%) 0, transparent 55%);',
        'bgHomeCard': 'radial-gradient(at 46% 33%, hsl(137, 98%, 21%) 0,transparent 89%), radial-gradient(at 82% 65%, hsl(136, 100%, 12%) 0, transparent 95%);'
      },
      backgroundColor: {
        'bgColor': '#202020',
        'bgInput': 'rgba(17, 25, 40, 0.39)'
      },
      fontFamily: {
        'custom-font': '"Poppins", serif',
        'unicons': ['Unicons', 'sans-serif'],
      },
      colors: {
        'custom-border': 'rgba(255,255,255,0.175)'
      },
      boxShadow: {
        'logoutBtn': '1px 1px 10px 2px rgba(255,0,0,0.607)',
        'signup-login': '1px 1px 20px 2px #00ff4849',
        'uploadBtn': '4px 1px 10px 0px black',
        'commentBtn': '1px 1px 10px 2px #00ff4849'
      },
      
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

