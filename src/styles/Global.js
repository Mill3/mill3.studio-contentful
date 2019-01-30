import { createGlobalStyle } from 'styled-components'


import Theme, { rebootCSS } from './Theme'

// console.log(Theme);

// import { media } from '@utils/mediaQuery'
// import Bg from '@static/images/bg-texture.jpg'

const GlobalStyle = createGlobalStyle`

  /* normalize css */
  ${rebootCSS}

  /* type */
  h1, .h1 {
    font-size: ${Theme.fontSizes[8]};
  }

  h2, .h2 {
    font-size: ${Theme.fontSizes[7]};
  }

  h3, .h3 {
    font-size: ${Theme.fontSizes[6]};
  }

  h4, .h4 {
    font-size: ${Theme.fontSizes[5]};
  }

  h5, .h5 {
    font-size: ${Theme.fontSizes[4]};
  }

  h6, .h6 {
    font-size: ${Theme.fontSizes[3]};
  }

  /* utils class */
  .is-light {
    font-weight: 300;
  }

  .is-normal {
    font-weight: normal;
  }

  .is-bold {
    font-weight: bold;
  }

  .fw-100 {
    font-weight: 100;
  }

  .fw-200 {
    font-weight: 200;
  }

  .fw-300 {
    font-weight: 300;
  }

  .fw-400 {
    font-weight: 400;
  }

  .fw-500 {
    font-weight: 500;
  }

  .fw-600 {
    font-weight: 600;
  }

  .fw-700 {
    font-weight: 700;
  }

  .fw-800 {
    font-weight: 800;
  }

  .fw-900 {
    font-weight: 900;
  }

  .is-sans {
    font-family: ${Theme.fonts.sans};
  }

  .is-serif {
    font-family: ${Theme.fonts.serif};
  }

  .z-negative {
    z-index: -1;
  }

  .z-0 {
    z-index: 0;
  }

  .z-10 {
    z-index: 10;
  }

  .z-20 {
    z-index: 20;
  }

  .img-fluid {
    max-width: 100%;
    width: 100%;
  }

`

export default GlobalStyle
