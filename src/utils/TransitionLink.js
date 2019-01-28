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

const TransitionLinkComponent = ({ to, intl: { locale }, ...props }) => {
  const path = `/${locale}${to}`

  return (
    <TransitionLink {...props} to={path}
      exit={{
        length: TRANSITION_EXIT_DURATION,
        delay: TRANSITION_DELAY
      }}
      entry={{
        length: TRANSITION_DURATION,
        delay: TRANSITION_DELAY
      }}
    />
  )
}

export default injectIntl(TransitionLinkComponent)