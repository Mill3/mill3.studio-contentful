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
    <TransitionLink {...props} to={path}
      exit={{
        delay: 0,
        length: TRANSITION_EXIT_DURATION,
        state: { 'transitionTitle': title, 'transitionColor': color }
      }}
      entry={{
        delay: TRANSITION_DELAY,
        length: TRANSITION_DURATION,
        state: { 'transitionTitle': title, 'transitionColor': color }
      }}
    />
  )
}

export default injectIntl(TransitionLinkComponent)