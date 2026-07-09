/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4EFE6',
        'paper-light': '#FDFBF7',
        ink: '#2C2A26',
        'ink-soft': '#5C5852',
        red: '#C94C4C',
        green: '#5A7D6E',
        brown: '#7B5E4A',
        cream: '#FDFBF7',
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', 'cursive'],
        body: ['"LXGW WenKai"', 'serif'],
        hand: ['Caveat', 'cursive'],
      },
      borderRadius: {
        'wobbly-sm': '255px 15px 225px 15px / 15px 225px 15px 255px',
        'wobbly-md': '255px 25px 225px 25px / 25px 225px 25px 255px',
        'wobbly-lg': '255px 35px 225px 35px / 35px 225px 35px 255px',
      },
      boxShadow: {
        paper: '2px 4px 0px 0px rgba(44,42,38,0.12)',
        'paper-lg': '4px 8px 0px 0px rgba(44,42,38,0.12)',
        stamp: 'inset 0 0 0 2px rgba(44,42,38,0.08)',
      },
      keyframes: {
        'wiggle-hover': {
          '0%, 100%': { transform: 'rotate(-1deg) translateY(0)' },
          '50%': { transform: 'rotate(1deg) translateY(-4px)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px) rotate(-2deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(0deg)' },
        },
      },
      animation: {
        'wiggle-hover': 'wiggle-hover 0.4s ease-in-out infinite',
        'draw-line': 'draw-line 1.2s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
