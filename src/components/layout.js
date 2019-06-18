import React, { useState } from 'react'
import { Location } from '@reach/router'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { IntlProvider, addLocaleData } from 'react-intl'
import { ThemeProvider } from 'styled-components'
import { Transition, TransitionGroup } from 'react-transition-group'
import Scrollbar from 'react-smooth-scrollbar'

// import main layout context
import LayoutContext, { defaultContextValue } from '@components/contexts/LayoutContext'

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

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

const messages = { en, fr }
const SCROLL_EVENT = typeof window === 'object' ? new Event('scroll') : null

addLocaleData([...enData, ...frData])

const Layout = ({ location, withIntro, introComponent, children } ) => {
  const [inTransition, setTransitionState] = useState(false)
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
        <Location>
          {({ location }) => (
            <IntlProvider locale={locale} messages={messages[locale]}>
              <React.Fragment>
                <GlobalStyle />

                <ThemeProvider theme={Theme}>
                  <React.Fragment>

                    <div>{console.log(location)}</div>

                    <TransitionPane
                      state={inTransition ? 'visible' : 'hidden'}
                      color="#ff0000"
                      title={data.site.siteMetadata.title}
                    />

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
                          <Transition
                            key={location.pathname}
                            appear={false}
                            mountOnEnter={true}
                            unmountOnExit={true}
                            timeout={{ enter: 850, exit: 750 }}
                            onEntered={() => setTransitionState(false)}
                            onExiting={() => setTransitionState(true)}
                          >
                            {children}
                          </Transition>
                        </TransitionGroup>

                        <Footer />
                      </Wrapper>
                    </Scrollbar>
                  </React.Fragment>
                </ThemeProvider>
              </React.Fragment>
            </IntlProvider>
          )}
        </Location>
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
