import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/extension/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    fontWeight: {
      normal: "400",
      medium: "500",
      bold: "600",
    },
    extend: {
      textColor: {
        default: "var(--color-grey-600)",
        primary: "var(--color-primary)",
      },

      backgroundColor: {
        default: "var(--color-bg-default)",
        primary: "var(--color-primary)",
        grey: "var(--color-grey)",
        "grey-600": "var(--color-grey-600)",
        "grey-700": "var(--color-grey-700)",
      },
    },
  },

  plugins: [require("@tailwindcss/forms")],
}
export default config
