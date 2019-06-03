import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { IntlProvider, addLocaleData } from 'react-intl'
import { TransitionState } from 'gatsby-plugin-transition-link'
import { ThemeProvider } from 'styled-components'
import { Text } from 'rebass'
import Scrollbar from 'react-smooth-scrollbar'

// Locale data
import enData from 'react-intl/locale-data/en'
import frData from 'react-intl/locale-data/fr'

// messages
import en from '@locales/en/en.json'
import fr from '@locales/fr/fr.json'

import Header from '@components/header'
import Footer from '@components/footer'
import Main from '@components/main'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

const messages = {en, fr}

const Wrapper = styled.div`
  height: 100vh;
`

const TransitionPane = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: #fff;
  transition: opacity 0.25s, background-color 0.25s;
  opacity: ${props => props.visible ? 1: 0};
  background-color: ${props => props.backgroundColor ? props.backgroundColor: "#000"};
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

        <IntlProvider locale={locale} messages={messages[locale]}>
          <React.Fragment>

            <GlobalStyle />

            <ThemeProvider theme={Theme}>

              <Scrollbar
                damping={0.08}
                thumbMinSize={55}
                alwaysShowTracks={false}
                continuousScrolling={true}
              >

                <TransitionState>
                  {({ transitionStatus, entry, exit }) => {
                    return (
                      <Wrapper id="wrapper">

                        <TransitionPane
                          visible={['exiting', 'exited', 'entering'].includes(transitionStatus) ? true : false}
                          backgroundColor={entry.state.transitionColor || exit.state.transitionColor}
                        >
                          <Text fontSize={[2,3,`5vw`]} className={`is-sans fw-300`}>{entry.state.transitionTitle || ""}</Text>
                        </TransitionPane>

                        {/* {console.log(transitionStatus, entry, exit)} */}

                        {/* main header */}
                        <Header withIntro={withIntro} siteTitle={data.site.siteMetadata.title} />

                        {/* main wrapper containing children pages */}
                        <Main children={children} />

                        <Footer />

                      </Wrapper>
                    )
                  }}
                </TransitionState>

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
