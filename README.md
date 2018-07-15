# savory
Bookmark Manager Extension for Chrome

## Requirements

- MUST work with the existing bookmarks, so that existing features like folders, sorting, sync
  continues to work
- MUST allow tagging bookmarks with multiple tags
- MUST be able to filter bookmarks by tags
- MUST be able to search by tags, url and title
- MUST preserve bookmark sort order as Chrome
- MUST support case insensitive tag names
- SHOULD be able to tag multiple bookmarks
- SHOULD be fast
- MAY search bookmarks as you type
- MAY override "add bookmark" popup to add tags

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
