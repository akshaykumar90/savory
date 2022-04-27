const amplitude = require('amplitude-js')

export const EVENT_LANDING_LOAD = 'registration - load landing page'
export const EVENT_SIGNUP_CTA = 'registration - click cta'
export const EVENT_SIGNUP_SUCCESS = 'registration - successful signup'

export const eventLogger = amplitude.getInstance()
