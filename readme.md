# Mini Baccarat course project

Course project implementation of mini baccarat.

[Latest version](https://scaling-enigma.surge.sh/)

## Technologies used:

- Typescript
- React
- Mobx
- Pixi.js

## Setup

This project uses yarn.
To install yarn

```
npm i -g yarn
```

## Decisions

- I chose vite as a bundler to save time and have a jump start.
- As CSS preprocessor I chose SCSS since I'm using BEM to name classes.
- For state management I used MobX to simplify integration between controller and view.
- As a canvas rendering library I chose pixi.js because of its simplicity and good abstractions.

## Development

To start development server

```
yarn dev
```

To build

```
yarn build
```

Features to implement (not ordered):

- [x] Game controls look and feel.
- [x] Overal UI improvments.
- [x] Canvas breakpoints.
- [x] View were you can enter your name.
- [x] Game status formatting.
- [x] Disable controls when betting is closed.
- [x] History.
- [x] Mobile version.
- [x] Improve readme.
- [x] Eslint.
- [x] Tests.
- [x] Display controls and username in header.
- [x] Texture managment
