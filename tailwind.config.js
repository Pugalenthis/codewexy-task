/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "body-bg": "#D3D3D3",
      },
    },
    debugScreens: {
      position: ["bottom", "left"],
    },
    style: {
      backgroundColor: "#C0FFEE",
      color: "black",
      // ...
    },
    prefix: "screen: ",
    selector: ".debug-screens",
  },
  plugins: [require("tailwindcss-debug-screens")],
};
