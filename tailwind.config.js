module.exports = {
  content: ['./src/**/*.{js,jsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#1A1A1A',
          card: '#2D2D2D',
        },
        light: {
          DEFAULT: '#F5F5F5',
          card: '#E0E0E0',
        },
        accent: {
          blue: '#3B82F6',
          green: '#10B981',
          red: '#EF4444',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};