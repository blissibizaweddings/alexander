import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"IM Fell DW Pica"', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif']
      },
      colors: {
        parchment: '#f2ede3',
        ink: '#2c1b12',
        accent: '#b2703d',
        sea: '#2f4858'
      }
    }
  },
  plugins: []
};

export default config;
