module.exports = {
  theme: {
    fontFamily: {
      sans: [
        "Inter UI",
        "system-ui",
        "BlinkMacSystemFont",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif"
      ]
    },

    textColor: theme => ({
      default: "var(--color-grey-800)",
      primary: "var(--color-primary)",
      muted: "var(--color-grey-600)",
      ...theme("colors")
    }),

    backgroundColor: theme => ({
      default: "var(--color-bg-default)",
      grey: "var(--color-grey)",
      "grey-100": "var(--color-grey-100)",
      "grey-200": "var(--color-grey-200)",
      "grey-300": "var(--color-grey-300)",
      ...theme("colors")
    }),

    borderColor: theme => ({
      default: theme("colors.grey-light"),
      primary: "var(--color-primary)",
      ...theme("colors")
    })
  },

  plugins: [
    require("@tailwindcss/custom-forms")
  ]
}
