import React from 'react'
import { Link } from 'gatsby'
import { injectIntl } from 'react-intl'

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, ...props }) => {
  const path = `/${locale}${to}`

  return <Link {...props} to={path} state={{ transitionColor: color || '#000', transitionTitle: title || 'Mill3' }} />
}

export default injectIntl(TransitionLinkComponent)
