/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // all files in src folder
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily:{
        cursive:['"Dancing Script"','cursive'],
      },
       animation:{
        marquee: "marquee 10s linear infinite",

      },
      colors:{
        slate:{
      gray:{
        100:"#eeeeef",
        200:"#e6e9ed",
        600:"#95989c"
      }
        },
        purple:{
          200:"#d9ddee",
          500:"#9492db",
          600:"#7164c0"
        }
      }
    },
  },
  plugins: [],
}

