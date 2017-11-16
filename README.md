# range-date

[![npm](https://img.shields.io/npm/v/range-date.svg)](https://www.npmjs.com/package/range-date) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> datepicker plugin Vue.js with possibility to choose dates-range

## Installation

```bash
npm install --save range-date
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import range-date from 'range-date'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'range-date/dist/range-date.css'

Vue.use(range-date)
```
```html
  <range-date></range-date>
```
### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="range-date/dist/range-date.css"></link>
<script src="range-date/dist/range-date.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/range-date/dist/range-date.css"></link>
<script src="https://unpkg.com/range-date"></script>
```

## Development

### Launch visual tests

```bash
npm run dev
```

### Launch Karma with coverage

```bash
npm run dev:coverage
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```


## Publishing

The `prepublish` hook will ensure dist files are created before publishing. This
way you don't need to commit them in your repository.

```bash
# Bump the version first
# It'll also commit it and create a tag
npm version
# Push the bumped package and tags
git push --follow-tags
# Ship it 🚀
npm publish
```

## License

[MIT](http://opensource.org/licenses/MIT)
