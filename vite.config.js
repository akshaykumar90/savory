import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const os = require('os')
const fs = require('fs')

const homedir = os.homedir()
const keyFilename = 'savory.test+4-key.pem'
const certFilename = 'savory.test+4.pem'

export default defineConfig({
  root: './src/pg',
  plugins: [vue()],
  server: {
    host: 'app.savory.test',
    port: 8008,
    https: {
      key: fs.readFileSync(`${homedir}/Projects/certs/${keyFilename}`),
      cert: fs.readFileSync(`${homedir}/Projects/certs/${certFilename}`),
    },
  },
})
