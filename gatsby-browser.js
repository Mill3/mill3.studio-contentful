/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import { push } from 'gatsby'

// import './src/styles/fonts.css'

export const onInitialClientRender = () => {

  let root = '/'
  // let detectedLocale = detectLocale()
  let detectedLocale = 'fr'

  // dispatch detected locale
  // store.dispatch({ type: 'SET_LOCALE', locale: detectedLocale })

  // on root only, redirect
  if (window.location.pathname === root) {
    push(`${detectedLocale}/`)
  }

}