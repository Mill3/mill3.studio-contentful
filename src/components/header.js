import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

import LocalizedLink from '@utils/LocalizedLink'

import locales from '@locales'

const Header = ({ siteTitle, intl: { locale } }) => (
  <div>
    <div>
      <h1>
        <LocalizedLink to={`/`}>
          {siteTitle}
        </LocalizedLink>
      </h1>
      <nav>
        {Object.keys(locales).map(key => (
          <Link
            className={key === locale ? 'is-active' : ''}
            key={locales[key].locale}
            to={`/${locales[key].path}/`}
          >
            {locales[key].locale}
          </Link>
        ))}
      </nav>

    </div>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  intl: intlShape.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default injectIntl(Header)
