import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

import LocalizedLink from '@utils/LocalizedLink'

import locales from '@locales'

const Header = ({ siteTitle, intl: { locale } }) => (
  <div
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <LocalizedLink
          to={`/`}
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </LocalizedLink>
      </h1>

      <nav>
        {Object.keys(locales).map(key => (
          <Link
            style={{
              color: 'white'
            }}
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
