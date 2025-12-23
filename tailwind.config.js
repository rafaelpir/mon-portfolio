/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Satoshi', 'system-ui', 'sans-serif'],
          stamp: ['Satoshi', 'sans-serif'],
        },
        colors: {
          beige: {
            light: '#FFFFFF',
            DEFAULT: '#E5E5E5',
            dark: '#CCCCCC',
          },
          orange: {
            light: '#FFFFFF',
            DEFAULT: '#E5E5E5',
            dark: '#CCCCCC',
          }
        },
        translate: {
          '101': '101%',
        },
        transitionTimingFunction: {
          slow: "cubic-bezier(.405, 0, .025, 1)",
        },
        transitionDuration: {
          mid: "3s",
        },
        keyframes: {
          marquee: {
            'from': { transform: 'translateX(0%)' },
            'to': { transform: 'translateX(-50%)' }
          },
          rotate3d: {
            '0%': { transform: 'rotateY(0deg) rotateX(0deg)' },
            '25%': { transform: 'rotateY(90deg) rotateX(15deg)' },
            '50%': { transform: 'rotateY(180deg) rotateX(0deg)' },
            '75%': { transform: 'rotateY(270deg) rotateX(-15deg)' },
            '100%': { transform: 'rotateY(360deg) rotateX(0deg)' }
          },
          rotate3dFull: {
            '0%': { transform: 'rotateY(0deg) rotateX(0deg)' },
            '25%': { transform: 'rotateY(90deg) rotateX(90deg)' },
            '50%': { transform: 'rotateY(180deg) rotateX(180deg)' },
            '75%': { transform: 'rotateY(270deg) rotateX(270deg)' },
            '100%': { transform: 'rotateY(360deg) rotateX(360deg)' }
          }
        },
        animation: {
          marquee: 'marquee 15s linear infinite',
          'spin-3d': 'rotate3d 10s linear infinite',
          'spin-3d-full': 'rotate3dFull 8s linear infinite'
        }
      },
    },
    plugins: [],
  }