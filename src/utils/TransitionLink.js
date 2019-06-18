import React from 'react'
import { Link } from 'gatsby'
import { injectIntl } from 'react-intl'

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, ...props }) => {
  const path = `/${locale}${to}`

  return (
    <Link
      {...props}
      to={path}
    />
  )
}

export default injectIntl(TransitionLinkComponent)
