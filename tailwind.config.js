module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue'],

  theme: {
    fontFamily: {
      sans: [
        'Inter',
        'system-ui',
        'BlinkMacSystemFont',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif'
      ]
    },

    extend: {
      textColor: {
        default: 'var(--color-grey-800)',
        primary: 'var(--color-primary)',
        muted: 'var(--color-grey-600)'
      },

      backgroundColor: {
        default: 'var(--color-bg-default)',
        primary: 'var(--color-primary)',
        grey: 'var(--color-grey)',
        'grey-100': 'var(--color-grey-100)',
        'grey-200': 'var(--color-grey-200)',
        'grey-300': 'var(--color-grey-300)'
      },

      borderColor: {
        default: 'var(--color-grey-800)',
        primary: 'var(--color-primary)'
      },

      inset: {
        '1/2': '50%'
      },

      opacity: {
        '90': '0.9'
      }
    }
  },

  plugins: [require('@tailwindcss/custom-forms')]
}
