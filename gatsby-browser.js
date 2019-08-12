/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import { navigate } from 'gatsby'

import './src/styles/fonts.css'

// export const shouldUpdateScroll = () => {
//   return false;
// };

// export const onInitialClientRender = () => {

//   let root = '/'

//   // TODO: let detectedLocale = detectLocale()
//   let detectedLocale = 'en'

//   // on root only, redirect
//   if (window.location.pathname === root) {
//     navigate(`${detectedLocale}/`)
//   }

// }

// export const onPreRouteUpdate = ({ location, prevLocation }) => {
//   console.log("Gatsby started to change location to", location.pathname)
//   console.time('PreRouteUpdate');
// }

// export const onRouteUpdate = ({ location }) => {
//   console.timeEnd('PreRouteUpdate');
// }

// export const shouldUpdateScroll = ({
//   routerProps: { location },
//   getSavedScrollPosition
// }) => {
//   const currentPosition = getSavedScrollPosition(location)
//   console.log(currentPosition, getSavedScrollPosition, location)
//   // console.log(SmoothScrollbar.getAll());

//   // let scrollbar = SmoothScrollbar.getAll()[0]
//   // // console.log(scrollbar);
//   // if (scrollbar && currentPosition) {
//   //   scrollbar.setPosition(currentPosition[0], currentPosition[1])
//   // }


//   // console.log('currentPosition:', currentPosition, location)
//   // const queriedPosition = getSavedScrollPosition({ pathname: `/random` })

//   setTimeout(() => {
//     console.log(`should scroll up`)
//     window.scrollTo(...(currentPosition || [0, 0]))
//   }, TRANSITION_DURATION * 1000);

//   return false
// }