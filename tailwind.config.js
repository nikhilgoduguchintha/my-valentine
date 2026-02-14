/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 0.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
