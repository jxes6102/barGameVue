/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'ball-1': "url('/src/assets/images/canpin_1.png')",
        'ball-2': "url('/src/assets/images/canpin_2.png')",
        'ball-3': "url('/src/assets/images/canpin_3.png')",
        'ball-4': "url('/src/assets/images/canpin_4.png')",
      }
    },
  },
  plugins: [],
}

