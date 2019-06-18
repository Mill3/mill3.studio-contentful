import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { IntlProvider, addLocaleData } from 'react-intl'
import { ThemeProvider } from 'styled-components'
import Scrollbar from 'react-smooth-scrollbar'

// import ContextConsumer from "./Context"

import LayoutContext, { defaultContextValue } from '@components/contexts/LayoutContext'

import { TRANSITION_ENTERING_DURATION, TRANSITION_EXIT_DURATION } from '@utils/constants'

// Locale data
import enData from 'react-intl/locale-data/en'
import frData from 'react-intl/locale-data/fr'

// messages
import en from '@locales/en.json'
import fr from '@locales/fr.json'

import Header from '@components/header'
import Footer from '@components/footer'
import Main from '@components/main'
import Wrapper from '@components/wrapper'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'
//import { hidden } from 'ansi-colors'

const SCROLL_EVENT = typeof window === 'object' ? new Event('scroll') : null

const messages = { en, fr }
console.log('messages:', messages)
addLocaleData([...enData, ...frData])

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
  transition-duration: ${props => props.duration}s, ${props => props.duration}s;
  transition-property: opacity, background-color;
  opacity: ${props => (props.visible ? 1 : 0)};
  background-color: ${props => (props.backgroundColor ? props.backgroundColor : '#000')};
`

const NoOverflowWrapper = styled.div`
  max-width: 100vw;
  overflow: hidden;
`
const onScroll = () => {
  if (SCROLL_EVENT) window.dispatchEvent(SCROLL_EVENT)
}

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.setOptions = this.setOptions.bind(this)
    this.state = {
      ...defaultContextValue,
      set: this.setOptions,
    }
  }

  setOptions(newData) {
    this.setState(state => ({
      options: {
        ...this.state.options,
        ...newData,
      },
    }))
  }

  render() {
    const { children } = this.props
    const locale = `en`

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <LayoutContext.Provider value={this.state}>
          <React.Fragment>
            <GlobalStyle />

            <ThemeProvider theme={Theme}>
              <Scrollbar
                damping={0.08}
                thumbMinSize={55}
                alwaysShowTracks={false}
                continuousScrolling={true}
                onScroll={onScroll}
              >
                <Wrapper id="wrapper">
                  {/* <TransitionPane
                    visible={['exiting', 'exited', 'entering'].includes(transitionStatus) ? true : false}
                    duration={
                      ['exiting', 'exited'].includes(transitionStatus)
                        ? TRANSITION_EXIT_DURATION
                        : TRANSITION_ENTERING_DURATION
                    }
                    backgroundColor={entry.state.transitionColor || exit.state.transitionColor}
                  >
                    <Text fontSize={[2, 3, `5vw`]} className={`is-sans fw-300`}>
                      {entry.state.transitionTitle || ''}
                    </Text>
                  </TransitionPane> */}

                  {/* wrapper for main content including the main header, preventing any horizontal scrollbar */}
                  <NoOverflowWrapper>
                    {/* main header */}
                    <Header />

                    {/* main wrapper containing children pages */}
                    <Main children={children} />
                  </NoOverflowWrapper>

                  <Footer />
                </Wrapper>
              </Scrollbar>
            </ThemeProvider>
          </React.Fragment>
        </LayoutContext.Provider>
      </IntlProvider>
    )
  }
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
