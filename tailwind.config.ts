import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f7f1e7',
          deep: '#eee4d3',
          cream: '#fff8ea',
        },
        ink: '#2c2924',
        petrol: {
          DEFAULT: '#526a68',
          deep: '#334848',
          light: '#dce8e5',
        },
        tweed: {
          DEFAULT: '#8b7a64',
          deep: '#675848',
        },
        copper: {
          DEFAULT: '#c2915d',
          light: '#f0dfc8',
        },
        sand: '#d7bd91',
        wash: '#dce8e5',
        line: 'rgba(112, 91, 70, 0.18)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': `
          radial-gradient(circle at 18% 10%, rgba(194,145,93,0.08), transparent 32%),
          radial-gradient(circle at 82% 22%, rgba(82,106,104,0.06), transparent 28%)
        `,
      },
      boxShadow: {
        card: '0 4px 24px rgba(67,55,43,0.08)',
        'card-hover': '0 8px 40px rgba(67,55,43,0.13)',
        subtle: '0 1px 4px rgba(67,55,43,0.06)',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}

export default config
