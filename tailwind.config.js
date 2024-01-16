/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        mygray: 'rgb(17, 17, 17)',
        tw_skills: '#ff003a',
        tw_projects: '#FC007B',
        tw_demos: '#D722B8',
        tw_about: '#8B56E5',
        tw_contact: '#0072F8'
      },
    },
  },
  plugins: [],
}