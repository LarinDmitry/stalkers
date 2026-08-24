# Overview:

## Getting started:

### Local version

    $ git clone ${repo}
    $ npm install
    $ npm start

### Prod version

    $ npm run build
    $ cd ~/build

### Storybook

    $ npm run storybook dev -p ${port}  // run
    $ npm run storybook build           // build

## Dev base knowledge:

[React](https://reactjs.org/)

[React Router](https://reactrouter.com/en/main/)

[Redux Toolkit](https://redux-toolkit.js.org/usage/usage-guide/)

[TypeScript](https://www.npmjs.com/package/typescript)

[Styled Components](https://styled-components.com/)

[Prettier](https://prettier.io/)

[Eslint](https://eslint.org/)

[Storybook](https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/)

## Recommended Layout:

### Breakpoints:

```
375 | 600 | 768 | 900 | 1024 | 1366 | 1536
[0, 768]     // Mobile
[768, 1280]  // isTablet
[1280, ∞]    // isLaptop
```

### Component base:

[Material Design](https://v3.mui.com/api/app-bar/)

### Fonts:

```
Manrope 400|500|700
```

### Icons:

`svg`

### Images:

`webp`
