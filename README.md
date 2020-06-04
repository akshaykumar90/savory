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

### pre-commit

Install [pre-commit](https://pre-commit.com/).

```bash
brew install pre-commit
```

Run `pre-commit install` to set up the git hook scripts so that `pre-commit` can run automatically on `git commit`.

### webpack watch

Instead of manually running `npm run build` every time, use the `dev` command
to automatically compile code whenever it changes.

```bash
npm run dev
```

### vue devtools

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

To sync current snapshot:

```bash
rm -rf src/stitch
./node_modules/.bin/stitch-cli export --app-id savory-backend-ailsq --output src/stitch
```

To deploy changes:

```bash
./node_modules/.bin/stitch-cli import --app-id savory-backend-ailsq --path src/stitch
```

[2]: https://www.mongodb.com/cloud/stitch
