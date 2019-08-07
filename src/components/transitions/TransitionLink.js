import React from 'react'
import { Link } from 'gatsby'
import { injectIntl } from 'react-intl'

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, localePrefix = true, ...props }) => {
  const path = localePrefix ? `/${locale}${to}` : `${to}`

  return (
    <Link
      {...props}
      to={path}
      activeClassName={`--active`}
      partiallyActive={true}
      state={{ transitionColor: color || '#000', transitionTitle: title || null }}
    />
  )
}

export default injectIntl(TransitionLinkComponent)
