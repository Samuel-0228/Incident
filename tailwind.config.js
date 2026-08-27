/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cicc: {
          bg: '#080808',
          subtle: '#101010',
          panel: '#141414',
          panelHeader: '#1A1A1A',
          border: '#242424',
          borderHighlight: '#3A3A3A',
          muted: '#777777',
          secondary: '#A0A0A0',
          primary: '#F5F5F5',
          white: '#FFFFFF',
          // Restrained status colors
          critical: '#DC2626',
          criticalBg: '#1C0D0D',
          criticalBorder: '#450A0A',
          warning: '#D97706',
          warningBg: '#1C150C',
          warningBorder: '#451A03',
          success: '#10B981',
          successBg: '#0D1C16',
          successBorder: '#064E3B',
          info: '#3B82F6',
          infoBg: '#0D1626',
          infoBorder: '#1E3A8A',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '6px',
        lg: '6px',
      }
    },
  },
  plugins: [],
}
