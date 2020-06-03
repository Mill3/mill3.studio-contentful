import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { IntlProvider, addLocaleData } from 'react-intl'
import { ThemeProvider } from 'styled-components'
import { TransitionGroup } from 'react-transition-group'
import SmoothScrollbar from 'smooth-scrollbar'
import Scrollbar from 'react-smooth-scrollbar'

import LayoutContext, { defaultContextValue } from '@components/contexts/LayoutContext'
import ScrollbarPausePlugin from '@utils/ScrollbarPausePlugin'
import ScrollbarDirectionPlugin from '@utils/ScrollbarDirectionPlugin'

// Locale data
import enData from 'react-intl/locale-data/en'
import frData from 'react-intl/locale-data/fr'

// messages
import en from '@locales/en.json'
import fr from '@locales/fr.json'

import { getLocale } from '@utils/Locales'

import Header from '@components/header'
import Footer from '@components/footer'
import TransitionPane, { TRANSITION_PANE_STATES } from '@components/transitions'
import Wrapper from '@components/wrapper'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

import { TRANSITION_DURATION } from '@utils/constants'
import DelayedTransition from '@utils/DelayedTransition'
import FullViewportHeight from '@utils/FullViewportHeight'

const messages = { en, fr }
const SCROLL_EVENT = typeof window === 'object' ? new Event('scroll') : null

SmoothScrollbar.use(ScrollbarPausePlugin, ScrollbarDirectionPlugin)
addLocaleData([...enData, ...frData])

class Layout extends React.Component {

  static childContextTypes = {
    layoutState: PropTypes.object
  };

  constructor(props) {
    super(props)

    this.setDemoReel = this.setDemoReel.bind(this)
    this.setHeaderInverted = this.setHeaderInverted.bind(this)
    this.setBodyInverted = this.setBodyInverted.bind(this)
    this.setTransitionState = this.setTransitionState.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)

    this.state = {
      ...defaultContextValue,
      transitionState: TRANSITION_PANE_STATES['intro'],
      setDemoReel: this.setDemoReel,
      setHeaderInverted: this.setHeaderInverted,
      setBodyInverted: this.setBodyInverted
    }

    this.scrollbarRef = createRef()
  }

  getChildContext() {
    return {
      layoutState: this.state
    };
  }

  setDemoReel(active = false, trigger = null) {
    this.setState(state => ({
      demoReel: {
        active,
        trigger,
      },
    }))
  }

  setHeaderInverted(inverted = false) {
    this.setState(state => ({
      invertedHeader: inverted
    }))
  }

  setBodyInverted(inverted = false, ref = null) {
    this.setState(state => ({
      invertedBody: inverted,
      invertedBodyRef: ref
    }))
  }

  setTransitionState(state) {
    let inTransition = state === TRANSITION_PANE_STATES['visible']
    this.setState({
      inTransition: inTransition,
      transitionState: state,
      options: {
        ...this.state.options,
      },
    })
  }

  onScroll() {
    if (SCROLL_EVENT) window.dispatchEvent(SCROLL_EVENT)
  }

  scrollToTop() {
    if( !this.scrollbarRef || !this.scrollbarRef.current || !this.scrollbarRef.current.scrollbar ) return

    this.scrollbarRef.current.scrollbar.scrollTo(0, 0)
  }

  render() {
    const { transitionState } = this.state
    const { children, pageContext } = this.props

    if (pageContext.layout === 'basic') {
      return(
        <React.Fragment>
          <GlobalStyle />
          <ThemeProvider theme={Theme}>
            {children}
          </ThemeProvider>
        </React.Fragment>
      )
    }

    return (
      <Location>
        {({ location }) => (
          <IntlProvider locale={pageContext.locale || getLocale(location)} messages={messages[pageContext.locale || getLocale(location)]}>
            <LayoutContext.Provider value={this.state}>
              <FullViewportHeight>

                <GlobalStyle inverted={this.state.invertedBody} />

                <ThemeProvider theme={Theme}>
                  <React.Fragment>

                    <TransitionPane
                      transitionState={transitionState}
                      location={location}
                      color={location.state && location.state.transitionColor !== undefined ? location.state.transitionColor : '#121212'}
                      title={location.state && location.state.transitionTitle !== undefined ? location.state.transitionTitle : null}
                    />

                    <Scrollbar
                      ref={this.scrollbarRef}
                      damping={0.0625}
                      renderByPixels={true}
                      syncCallbacks={true}
                      alwaysShowTracks={false}
                      continuousScrolling={true}
                      onScroll={this.onScroll}
                    >
                      <Wrapper>

                        {/* main header */}
                        <Header />

                        {/* main wrapper containing children pages */}
                        <TransitionGroup component="main">
                          <DelayedTransition
                            key={location.pathname}
                            name={location.pathname}
                            appear={false}
                            mountOnEnter={true}
                            unmountOnExit={true}
                            delay={{
                              enter: TRANSITION_DURATION
                            }}
                            timeout={{
                              exit: TRANSITION_DURATION
                            }}
                            onExit={e => {
                              this.setTransitionState(TRANSITION_PANE_STATES['visible'])
                            }}
                            onEntering={e => {
                              this.scrollToTop()
                              this.setTransitionState(TRANSITION_PANE_STATES['hidden'])
                            }}
                          >
                            {children}
                          </DelayedTransition>
                        </TransitionGroup>

                        <Footer />
                      </Wrapper>
                    </Scrollbar>
                  </React.Fragment>
                </ThemeProvider>

              </FullViewportHeight>
            </LayoutContext.Provider>
          </IntlProvider>
        )}
      </Location>
    )
  }
}

Layout.defaultProps = {
  withIntro: false,
  introComponent: null
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  withIntro: PropTypes.bool,
}

export default Layout
