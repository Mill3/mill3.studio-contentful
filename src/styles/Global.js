import { createGlobalStyle } from 'styled-components'


import Theme, { rebootCSS } from './Theme'

// console.log(Theme);

// import { media } from '@utils/mediaQuery'
// import Bg from '@static/images/bg-texture.jpg'

const GlobalStyle = createGlobalStyle`

  /* normalize css */
  ${rebootCSS}

`

export default GlobalStyle
