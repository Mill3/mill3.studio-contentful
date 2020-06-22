import React, { useContext, useCallback } from 'react'
import { injectIntl } from 'gatsby-plugin-intl'
import { Link, navigate } from 'gatsby'

import { LayoutContext } from '@layouts/layoutContext'
import { TRANSITION_DURATION } from '@utils/constants'

const TransitionLinkComponent = ({ to, intl: { locale }, title = null, color = '#121212', localePrefix = true, ...props }) => {
  const { dispatch } = useContext(LayoutContext)
  const path = localePrefix ? `/${locale}${to}` : `${to}`
  const { children } = props

  const handleClick = useCallback(
    e => {
      e.preventDefault()

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
    [color, title]
  )

  return (
    <Link
      to={path}
      {...props}
      activeClassName={`--active`}
      partiallyActive={true}
      // state={{ transitionColor: color || 'black', transitionTitle: title || null }}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

export default injectIntl(TransitionLinkComponent)
