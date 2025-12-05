export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'raspberry': '#E83F4B',
        'beige': {
          100: '#F6F5F1',
          200: '#EFEEE8',
          400: '#E0DDD1',
        },
        'gadki-black': '#1E1E1E',
      },
      fontFamily: {
        'display': ['Fredoka', 'Happy Season', 'sans-serif'],
        'body': ['Lato', 'sans-serif'],
      },
      spacing: {
        'hero': '1176px',
      },
    },
  },
  plugins: [],
}
