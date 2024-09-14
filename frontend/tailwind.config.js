/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'white':'#fff',
      'blue':'#0b00ff',
      'red':'#ff0000',
      'grey':'#cdd0d5',
      'green':'#00A41D',
      'yellow':'#BCC224',
      'orange':'#FF9000',
      'black':'#000000'
    },
  },
  plugins: [],
}