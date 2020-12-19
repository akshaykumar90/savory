const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue'],

  theme: {
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

      placeholderColor: {
        default: 'var(--color-grey)',
      },

      backgroundColor: {
        default: 'var(--color-bg-default)',
        primary: 'var(--color-primary)',
        grey: 'var(--color-grey)',
        'grey-100': 'var(--color-grey-100)',
        'grey-200': 'var(--color-grey-200)',
        'grey-300': 'var(--color-grey-300)',
      },

      borderColor: {
        default: 'var(--color-grey-800)',
        primary: 'var(--color-primary)',
      },

      inset: {
        '1/2': '50%',
      },
    },
  },

  plugins: [require('@tailwindcss/forms')],
}
