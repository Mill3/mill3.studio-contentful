import { createGlobalStyle } from 'styled-components'

import Theme, { rebootCSS } from './Theme'

const GlobalStyle = createGlobalStyle`

  /* normalize css */
  ${rebootCSS}

  body {
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: none;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeSpeed;
    overflow: hidden;
  }

  /* type */
  h1, .h1 {
    font-size: ${Theme.fontSizes[8]}px;
    font-family: ${Theme.fonts.headings};
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

  .is-serif-headings {
    font-family: ${Theme.fonts.headings};
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

  .img-forced {
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

  .full-vh {
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
  }

  .btn-reset {
    border: none;
    border-radius: 0;
    cursor: pointer;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    outline: none !important;

    background: transparent;

    /* inherit font & color from ancestor */
    color: inherit;
    font: inherit;
    text-align: inherit;

    /* Normalize line-height. Cannot be changed from normal in Firefox 4+. */
    line-height: normal;

    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    /* Corrects inability to style clickable input types in iOS */
    -webkit-appearance: none;
  }

`

export default GlobalStyle
