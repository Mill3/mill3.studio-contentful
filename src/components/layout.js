import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { IntlProvider, addLocaleData } from 'react-intl'
import { ThemeProvider } from 'styled-components'
import { TransitionGroup } from 'react-transition-group'
import Scrollbar from 'react-smooth-scrollbar'

// Locale data
import enData from 'react-intl/locale-data/en'
import frData from 'react-intl/locale-data/fr'

// messages
import en from '@locales/en.json'
import fr from '@locales/fr.json'

import Header from '@components/header'
import Footer from '@components/footer'
import TransitionPane from '@components/transitions'
import Wrapper from '@components/wrapper'
//import TransitionGroupPlus from '@utils/TransitionGroupPlus'
import DelayedTransition from '@utils/DelayedTransition'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

const messages = { en, fr }
const SCROLL_EVENT = typeof window === 'object' ? new Event('scroll') : null

addLocaleData([...enData, ...frData])


const Layout = ({ location, withIntro, introComponent, children }) => {
  const [ inTransition, setTransitionState ] = useState(false)
  const locale = `en`
  const onScroll = () => {
    if (SCROLL_EVENT) window.dispatchEvent(SCROLL_EVENT)
  }

  return (
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
          <React.Fragment>
            <GlobalStyle />

            <ThemeProvider theme={Theme}>
              <React.Fragment>
                <TransitionPane state={inTransition ? 'visible' : 'hidden'} color="#ff0000" title={data.site.siteMetadata.title} />

                <Scrollbar
                  damping={0.08}
                  thumbMinSize={55}
                  alwaysShowTracks={false}
                  continuousScrolling={true}
                  onScroll={onScroll}
                >

                  <Wrapper>
                    {/* main header */}
                    <Header
                      withIntro={withIntro}
                      introComponent={introComponent}
                      siteTitle={data.site.siteMetadata.title}
                    />

                    {/* main wrapper containing children pages */}
                    <TransitionGroup component="main">
                      <DelayedTransition
                        key={location.pathname}
                        appear={false}
                        mountOnEnter={true}
                        unmountOnExit={true}
                        delay={{enter: 8000}}
                        timeout={{enter: 0, exit: 0}}
                        onExiting={() => setTransitionState(true)}
                      >
                        {children}
                      </DelayedTransition>
                    </TransitionGroup>

                    <Footer />
                  </Wrapper>

                </Scrollbar>
              </React.Fragment>
            </ThemeProvider>

          </React.Fragment>
        </IntlProvider>
      )}
    />
  )
}

Layout.defaultProps = {
  withIntro: false,
  introComponent: null,
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  withIntro: PropTypes.bool,
}

export default Layout