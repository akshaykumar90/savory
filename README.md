# savory

Bookmark Manager Extension for Chrome

## Setup

``` bash
# install dependencies
yarn install

# build extension in build/
npm run build
```

In Chrome:

1. Go to `chrome://extensions/`
2. Load Unpacked
3. Select build directory

## Development

Instead of manually running `npm run build` every time, use the `dev` command
to automatically compile code whenever it changes.

```bash
npm run dev
```

To use [vue-devtools][1], use the standalone Electron app

```bash
./node_modules/.bin/vue-devtools
```

[1]:https://github.com/vuejs/vue-devtools
