/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './App.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'bg-primary':      '#FAF8F5',
        'surface':         '#FFFFFF',
        'brand-primary':   '#D4724A',
        'brand-secondary': '#4A7D8C',
        'mood-positive':   '#7DB87A',
        'mood-negative':   '#C4735A',
        'text-primary':    '#1A1A22',
        'text-muted':      '#6E6E7E',
        'border-color':    '#E2E2E8',
        'error':           '#D94F4F',
        'success':         '#3D9A5C',
      },
      borderRadius: {
        'card': '16px',
      },
      spacing: {
        'screen-edge': '24px',
        'card-pad':    '16px',
      },
    },
  },
  plugins: [],
};
