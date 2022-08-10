/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.@(js|jsx|ts|tsx|html)', './pages/**/*.@(js|jsx|ts|tsx|html)'],
  theme: {
    extend: {
      screens: {
        // => @media (min-width: 640px) { ... }
        sm: '640px',
        // => @media (min-width: 768px) { ... }
        md: '768px',
        // => @media (min-width: 1024px) { ... }
        lg: '1024px',
        // => @media (min-width: 1280px) { ... }
        xl: '1280px',
        // => @media (min-width: 1536px) { ... }
        '2xl': '1536px',
      },
      zIndex: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        dropdown: '100',
        backdrop: '200',
        fixed: '700',
        modal: '800',
        popover: '900',
        tooltip: '1000',
      },
      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
};
