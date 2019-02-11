/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import { push } from 'gatsby'
import SmoothScrollbar from 'smooth-scrollbar'

import './src/styles/fonts.css'

import { TRANSITION_DURATION } from './src/utils/constants'

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

// export const shouldUpdateScroll = ({
//   routerProps: { location },
//   getSavedScrollPosition
// }) => {
//   const currentPosition = getSavedScrollPosition(location)
//   console.log(currentPosition, getSavedScrollPosition, location)
//   // console.log(SmoothScrollbar.getAll());

//   let scrollbar = SmoothScrollbar.getAll()[0]
//   // console.log(scrollbar);
//   if (scrollbar && currentPosition) {
//     scrollbar.setPosition(currentPosition[0], currentPosition[1])
//   }


//   // console.log('currentPosition:', currentPosition, location)
//   // const queriedPosition = getSavedScrollPosition({ pathname: `/random` })


//   // window.scrollTo(...(currentPosition || [0, 0]))
//   // setTimeout(() => {
//   //   console.log(`should scroll up`)
//   //   window.scrollTo(...(currentPosition || [0, 0]))
//   // }, TRANSITION_DURATION * 1000);

//   return true
// }