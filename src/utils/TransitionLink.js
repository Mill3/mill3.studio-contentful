import React from 'react'
import { Link } from 'gatsby'
import { injectIntl } from 'react-intl'

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, delay, localePrefix = true, ...props }) => {
  const path = localePrefix ? `/${locale}${to}` : `${to}`

  return <Link {...props} to={path} state={{ transitionColor: color || '#000', transitionTitle: title || 'Mill3' }} />
}

export default injectIntl(TransitionLinkComponent)
