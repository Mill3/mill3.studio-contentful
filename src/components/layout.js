import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { IntlProvider, addLocaleData } from 'react-intl'
import { TransitionPortal } from "gatsby-plugin-transition-link"
import { ThemeProvider } from 'styled-components'
// import SmoothScrollbar from 'smooth-scrollbar'
// import OverscrollPlugin from 'smooth-scrollbar/plugins/overflow'
import Scrollbar from 'react-smooth-scrollbar'

// SmoothScrollbar.use(OverscrollPlugin)

// Locale data
import enData from 'react-intl/locale-data/en'
import frData from 'react-intl/locale-data/fr'

// messages
import en from '../../locales/en/en.json'
import fr from '../../locales/fr/fr.json'

import Header from '@components/header'
import Footer from '@components/footer'
import Main from './main'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'
import TransitionPane from '@components/transitions'

const messages = {en, fr}

const Wrapper = styled.div`
  height: 100vh;
`

addLocaleData([...enData, ...frData])

const Layout = ({ locale, withIntro, children }) => (
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
      <>

      {/* transition between pages */}
      <TransitionPortal>
        <TransitionPane />
      </TransitionPortal>

      <IntlProvider locale={locale} messages={messages[locale]}>
        <React.Fragment>

          {/* global bvase style */}
          <GlobalStyle />

          {/* base theme provider */}
          <ThemeProvider theme={Theme}>

            <Scrollbar
              damping={0.08}
              thumbMinSize={55}
              alwaysShowTracks={false}
              continuousScrolling={true}
            >

              <Wrapper id="wrapper">

                {/* main header */}
                <Header withIntro={withIntro} siteTitle={data.site.siteMetadata.title} />

                {/* main wrapper containing children pages */}
                <Main children={children} />

                <Footer />

              </Wrapper>

            </Scrollbar>

          </ThemeProvider>

        </React.Fragment>
      </IntlProvider>
      </>
    )}
  />
)

Layout.defaultProps = {
  headerInverted: false,
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  headerInverted: PropTypes.bool,
}

export default Layout
