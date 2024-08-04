const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{html,vue}'],

  future: {
    hoverOnlyWhenSupported: true,
  },

  theme: {
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 600,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },

      textColor: {
        default: 'var(--color-grey-600)',
        primary: 'var(--color-primary)',
      },

      backgroundColor: {
        default: 'var(--color-bg-default)',
        primary: 'var(--color-primary)',
        grey: 'var(--color-grey)',
        'grey-600': 'var(--color-grey-600)',
        'grey-700': 'var(--color-grey-700)',
      },
    },
  },

  plugins: [require('@tailwindcss/forms')],
}
