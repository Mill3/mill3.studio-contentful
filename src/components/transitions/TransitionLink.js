import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from "gatsby-plugin-intl"
// import TransitionLink, { TransitionState } from "gatsby-plugin-transition-link";
import { Link, navigate } from "gatsby"

import { LayoutContext } from "@layouts"

// import { TRANSITION_PANE_STATES } from '@components/transitions'

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, localePrefix = true, ...props }) => {
  const { state, dispatch } = useContext(LayoutContext);
  const path = localePrefix ? `/${locale}${to}` : `${to}`
  const { children } = props;

  const transition = (e) => {
    e.preventDefault()
    dispatch({type: "transition.setState", transitionState: `exiting`, inTransition: true})
    setTimeout(() => navigate(path), 1500)
    return false;
  }

  return (
    <Link
      to={path}
      enter={{
        length: 2,
      }}
      exit={{
        length: 0,
        state : {
          transitionColor: color || 'black',
          transitionTitle: title || null
        },
      }}
      {...props}
      activeClassName={`--active`}
      partiallyActive={true}
      state={{ transitionColor: color || 'black', transitionTitle: title || null }}
      onClick={(e) => transition(e)}
    >
      {children}
    </Link>
  )
}

TransitionLinkComponent.contextTypes = {
  TransitionState: PropTypes.object,
}

export default injectIntl(TransitionLinkComponent)
