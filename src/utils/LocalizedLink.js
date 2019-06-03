import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

//import locales from '@locales'

const LocalizedLink = ({ to, intl: { locale }, ...props }) => {
  const path = `/${locale}${to}`

  return <Link {...props} to={path} />
}

LocalizedLink.propTypes = {
  to: PropTypes.string.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(LocalizedLink)
