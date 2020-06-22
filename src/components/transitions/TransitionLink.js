import React, { useContext, useCallback } from 'react'
import { injectIntl } from 'gatsby-plugin-intl'
import { Link, location, navigate } from 'gatsby'

import { LayoutContext } from '@layouts/layoutContext'
import { TRANSITION_DURATION } from '@utils/constants'

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
      if(location === path) return;

      dispatch({
        type: 'transition.linkState',
        transitionColor: color,
        transitionTitle: title,
      })

      dispatch({
        type: 'transition.setState',
        transitionState: `started`,
        inTransition: true,
      })

      // change location
      setTimeout(function() {
        navigate(path)
      }, TRANSITION_DURATION)
    },
    [color, title, dispatch, path]
  )

  return (
    <Link
      to={path}
      {...props}
      activeClassName={`--active`}
      partiallyActive={true}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

export default injectIntl(TransitionLinkComponent)
