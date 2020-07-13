import React, { useContext, useCallback } from 'react'
import { injectIntl } from 'gatsby-plugin-intl'
import { Link } from 'gatsby'

import { LayoutContext } from '@layouts/layoutContext'
import { TRANSITION_PANE_STATES } from '@utils/constants'

const TransitionLinkComponent = ({ to, intl, title = null, color = '#121212', localePrefix = true, children, ...props }) => {
  const { dispatch } = useContext(LayoutContext)
  const { locale } = intl
  const path = localePrefix ? `/${locale}${to}` : `${to}`

  const handleClick = useCallback(
    e => {
      e.preventDefault()

      // First, do nothing if on same location
      const location = window.location.pathname
      if (location === path) return


      //console.log('-------------')

      // set transitionPane color and title
      // save new page's path
      // start transition
      dispatch({
        type: 'transition.changePage',
        transitionColor: color,
        transitionTitle: title,
        transitionState: TRANSITION_PANE_STATES[`leaving`],
        transitionPath: path,
        inTransition: true,
      })
    },
    [color, title, dispatch, path]
  )

  return (
    <Link to={path} {...props} activeClassName={`--active`} partiallyActive={true} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default React.memo(injectIntl(TransitionLinkComponent))
