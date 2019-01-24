import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { IntlProvider, addLocaleData } from 'react-intl'
import { ThemeProvider } from 'styled-components'

// Locale data
import enData from 'react-intl/locale-data/en'
import frData from 'react-intl/locale-data/fr'

// messages
import en from '../../locales/en/en.json'
import fr from '../../locales/fr/fr.json'

import Header from './header'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

const messages = {en, fr}

addLocaleData([...enData, ...frData])

const Layout = ({ locale, children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <>

          {/* global bvase style */}
          <GlobalStyle />

          {/* base theme provider */}
          <ThemeProvider theme={Theme}>

            <div id="wrapper">
              {/* main header */}
            <Header siteTitle={data.site.siteMetadata.title} />

            {/* main wrap */}
            <main>
              {children}
              <footer>
                © {new Date().getFullYear()}, Built with
                {` `}
                <a href="https://www.gatsbyjs.org">Gatsby</a>
              </footer>
            </main>

            </div>

          </ThemeProvider>

        </>
      </IntlProvider>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
