import React, { useContext, useCallback } from 'react'
import { injectIntl } from 'gatsby-plugin-intl'
import { Link, location, navigate } from 'gatsby'

import { LayoutContext } from '@layouts/layoutContext'
import { TRANSITION_PANE_STATES, TRANSITION_DURATION, TRANSITION_OUT_DURATION } from '@utils/constants'

const sleep = (ms, cb) => new Promise(resolve => setTimeout(resolve, ms))

const TransitionLinkComponent = ({ to, intl, title = null, color = '#121212', localePrefix = true, ...props }) => {
  const { dispatch } = useContext(LayoutContext)
  const { locale } = intl
  const path = localePrefix ? `/${locale}${to}` : `${to}`
  const { children } = props

  const handleClick = useCallback(
    e => {
      e.preventDefault()

      // do nothing if on same location
      const location = window.location.pathname
      if (location === path) return

      // set color and title
      dispatch({
        type: 'transition.linkState',
        transitionColor: color,
        transitionTitle: title,
      })

      let transitionStarted = new Promise((resolve) => {

        // start transition
        dispatch({
          type: 'transition.setState',
          transitionState: TRANSITION_PANE_STATES[`started`],
          inTransition: true,
        })

        // wait a bit
        let wait = setTimeout(() => {
          clearTimeout(wait)
          resolve('started')
        }, TRANSITION_OUT_DURATION / 3)
      })

      let transitionLeaving = new Promise((resolve) => {

        dispatch({
          type: 'transition.setState',
          transitionState: TRANSITION_PANE_STATES[`leaving`],
          inTransition: true,
        })

        let wait = setTimeout(() => {
          clearTimeout(wait)
          resolve('leaving')
        }, TRANSITION_OUT_DURATION) // extend transition out just a little bit
      })

      Promise.all([transitionStarted, transitionLeaving]).then(() => {
        // console.log('values:', values)
        navigate(path)
      });

      // new Promise((resolve, reject) => {
      //   let wait = setTimeout(() => {

      //     clearTimeout(wait)

      //     dispatch({
      //       type: 'transition.setState',
      //       transitionState: TRANSITION_PANE_STATES[`started`],
      //       inTransition: true,
      //     })

      //     resolve()
      //   }, TRANSITION_DURATION)

      // }).then(() => {

      //   dispatch({
      //     type: 'transition.setState',
      //     transitionState: TRANSITION_PANE_STATES[`leaving`],
      //     inTransition: true,
      //   })

      //   new Promise((resolve, reject) => {
      //     let wait = setTimeout(() => {
      //       clearTimeout(wait)
      //       resolve()
      //     }, TRANSITION_DURATION)
      //   }).then(() => {
      //     navigate(path)
      //   })
      // })

      // race.then((value) => {
      //   // change location
      //   setTimeout(function() {
      //     navigate(path)
      //   }, TRANSITION_DURATION)
      // })
    },
    [color, title, dispatch, path]
  )

  return (
    <Link to={path} {...props} activeClassName={`--active`} partiallyActive={true} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default injectIntl(TransitionLinkComponent)
