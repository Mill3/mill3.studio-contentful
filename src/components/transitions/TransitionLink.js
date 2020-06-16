import React from 'react'
import { injectIntl } from "gatsby-plugin-intl"
import { Link } from "gatsby"

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, localePrefix = true, ...props }) => {
  const path = localePrefix ? `/${locale}${to}` : `${to}`
  const { children } = props;

  return (
    <Link
      to={path}
      {...props}
      activeClassName={`--active`}
      partiallyActive={true}
      state={{ transitionColor: color || 'black', transitionTitle: title || null }}
    >
      {children}
    </Link>
  )
}

export default injectIntl(TransitionLinkComponent)
