import { createGlobalStyle, keyframes } from 'styled-components'


import Theme, { rebootCSS } from './Theme'

const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  to {
    opacity: 0;
  }
`

// console.log(Theme);

// import { media } from '@utils/mediaQuery'
// import Bg from '@static/images/bg-texture.jpg'

const GlobalStyle = createGlobalStyle`

  /* normalize css */
  ${rebootCSS}

  body {
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: none;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeSpeed;
    scroll-behavior: smooth;
    /* overflow-x: hidden; */
  }

  /* type */
  h1, .h1 {
    font-size: ${Theme.fontSizes[8]}px;
    font-weight: 300;
  }

  h2, .h2 {
    font-size: ${Theme.fontSizes[6]}px;
    font-weight: 300;
  }

  h3, .h3 {
    font-size: ${Theme.fontSizes[5]}px;
    font-weight: 300;
  }

  h4, .h4 {
    font-size: ${Theme.fontSizes[4]}px;
    font-weight: 300;
  }

  h5, .h5 {
    font-size: ${Theme.fontSizes[3]}px;
    font-weight: 300;
  }

  h6, .h6 {
    font-size: ${Theme.fontSizes[2]}px;
    font-weight: 300;
  }

  p {
    font-size: ${Theme.fontSizes[3]}px;
    font-weight: 300;
    a {
      color: ${Theme.colors.black};
      text-decoration: underline;
    }
  }

  blockquote {
    p {
      font-size: ${Theme.fontSizes[4]}px;
    }
  }

  /* utils class */
  .is-relative {
    position: relative;
  }

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

  .is-gray {
    color: ${Theme.colors.gray};
  }

  .img-fluid {
    max-width: 100%;
    width: 100%;
  }

  .is-center {
    text-align: center;
  }

  .is-left {
    text-align: left;
  }

  .is-right {
    text-align: right;
  }

  /* transition wrapper */

  .tl-wrapper {
    animation-name: ${fadeIn};
    animation-duration: 0.25s;
    animation-fill-mode: both;
    background: #fff;
    min-height: 100vh;
  }

  /* animation */
  .fade-in {
    animation-name: ${fadeIn};
    animation-duration: 1s;
    animation-delay: 1s;
    animation-fill-mode: both;
  }

  .fade-out {
    animation-name: ${fadeOut};
    animation-duration: 1s;
    animation-fill-mode: both;
  }

`

export default GlobalStyle
