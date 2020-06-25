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

      // First, do nothing if on same location
      const location = window.location.pathname
      if (location === path) return

      // 1. set color and title
      dispatch({
        type: 'transition.linkState',
        transitionColor: color,
        transitionTitle: title,
      })

      // 2. start transition
      let transitionStarted = new Promise((resolve) => {
        dispatch({
          type: 'transition.setState',
          transitionState: TRANSITION_PANE_STATES[`started`],
          inTransition: true,
        })
        resolve('started')
      })

      // 2. show transition pane
      let transitionLeaving = new Promise((resolve) => {
        dispatch({
          type: 'transition.setState',
          transitionState: TRANSITION_PANE_STATES[`leaving`],
          inTransition: true,
        })

        let wait = setTimeout(() => {
          clearTimeout(wait)
          resolve('leaving')
        }, TRANSITION_OUT_DURATION * 2)
      })

      // run all Promises above
      Promise.all([transitionStarted, transitionLeaving]).then(() => {
        navigate(path)
      });
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
