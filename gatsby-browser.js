/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import { LayoutContext } from "@layouts"
import { navigate } from 'gatsby'

import './src/styles/fonts.css'

export const onInitialClientRender = () => {

  let root = '/'
  let detectedLocale = 'en'

  // on root only, redirect
  if (window.location.pathname === root) {
    navigate(`${detectedLocale}/`)
  }

}

// export const onRouteUpdate = ({ location, prevLocation }) => {
//   console.log('new pathname', location.pathname)
//   console.log('old pathname', prevLocation ? prevLocation.pathname : null)
// }