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

Set `DEVTOOLS=true` to use [vue-devtools][1].

```bash
DEVTOOLS=true npm run dev
```

The chrome extension for `vue-devtools` does not work with chrome extensions.
Instead, use the standalone Electron app for vue-devtools.

```bash
./node_modules/.bin/vue-devtools
```

[1]:https://github.com/vuejs/vue-devtools

## Backend

Savory uses [MongoDB Stitch][2] as its serverless backend.

To deploy changes:

```bash
./node_modules/.bin/stitch-cli import --app-id savory-backend-ailsq --path src/stitch
```

[2]: https://www.mongodb.com/cloud/stitch
