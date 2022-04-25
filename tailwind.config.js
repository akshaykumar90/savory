const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{html,vue}'],

  theme: {
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },

      textColor: {
        default: 'var(--color-grey-800)',
        primary: 'var(--color-primary)',
        muted: 'var(--color-grey-600)',
        'grey-300': 'var(--color-grey-300)',
        'grey-400': 'var(--color-grey-400)',
        'grey-500': 'var(--color-grey)',
      },

      backgroundColor: {
        default: 'var(--color-bg-default)',
        primary: 'var(--color-primary)',
        grey: 'var(--color-grey)',
        'grey-100': 'var(--color-grey-100)',
        'grey-200': 'var(--color-grey-200)',
        'grey-300': 'var(--color-grey-300)',
      },
    },
  },

  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')],
}
