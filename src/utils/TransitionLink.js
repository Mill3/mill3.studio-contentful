import React, { Children } from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import TransitionLink from 'gatsby-plugin-transition-link'

import {
  TRANSITION_DURATION,
  TRANSITION_DELAY,
  TRANSITION_EXIT_DURATION
} from '@utils/constants'

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, ...props }) => {
  const path = `/${locale}${to}`

  return (
    <TransitionLink
      {...props}
      to={path}
      exit={{
        // delay: 2,
        length: TRANSITION_DURATION,
        trigger: ({ node, exit }) => {
          node.classList.add('fade-out')
        },
        state: { 'transitionTitle': title, 'transitionColor': color },
        zIndex: 2
      }}
      entry={{
        // delay: TRANSITION_DURATION,
        length: TRANSITION_DURATION,
        state: { 'transitionTitle': title, 'transitionColor': color },
        trigger: ({ node, entry }) => {
          node.classList.add('fade-in')
        },
        zIndex: 1,
      }}
    />
  )
}

export default injectIntl(TransitionLinkComponent)