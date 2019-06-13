import React from 'react'
// import { Link } from 'gatsby'
import { injectIntl } from 'react-intl'
import TransitionLink from 'gatsby-plugin-transition-link'

import {
  TRANSITION_ENTERING_DURATION,
  TRANSITION_EXIT_DURATION
} from '@utils/constants'

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, ...props }) => {
  const path = `/${locale}${to}`

  return (
    <TransitionLink
      {...props}
      to={path}
      exit={{
        length: TRANSITION_EXIT_DURATION,
        state: { 'transitionTitle': title, 'transitionColor': color },
        // trigger: ({ node, exit }) => {
        //   console.log(exit, title)
        // },
        zIndex: 1
      }}
      entry={{
        length: TRANSITION_ENTERING_DURATION,
        state: { 'transitionTitle': title, 'transitionColor': color },
        zIndex: 2
      }}
    />
  )
}

export default injectIntl(TransitionLinkComponent)
