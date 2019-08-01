import React, { createRef } from 'react'
import { Location } from '@reach/router'
import PropTypes from 'prop-types'
import { IntlProvider, addLocaleData } from 'react-intl'
import { ThemeProvider } from 'styled-components'
import { TransitionGroup } from 'react-transition-group'
import Scrollbar from 'react-smooth-scrollbar'

import LayoutContext, { defaultContextValue } from '@components/contexts/LayoutContext'

// Locale data
import enData from 'react-intl/locale-data/en'
import frData from 'react-intl/locale-data/fr'

// messages
import en from '@locales/en.json'
import fr from '@locales/fr.json'

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

addLocaleData([...enData, ...frData])

const getLocale = (location) => {
  return location.pathname.split('/')[1]
}

class Layout extends React.Component {
  constructor(props) {
    super(props)

    this.setOptions = this.setOptions.bind(this)
    this.setTransitionState = this.setTransitionState.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)

    this.state = {
      ...defaultContextValue,
      transitionState: TRANSITION_PANE_STATES['initial'],
      set: this.setOptions,
    }

    this.scrollbarRef = createRef()
  }

  setOptions(newData) {
    this.setState(state => ({
      options: {
        ...this.state.options,
        ...newData,
      },
    }))
  }

  setTransitionState(state) {
    console.log('state:', state)
    // this.setOptions({
    //   inTransition: state,
    //   transitionState: (state === true) ? TRANSITION_PANE_STATES['visible'] : TRANSITION_PANE_STATES['hidden'],
    // })
    let inTransition = (state === TRANSITION_PANE_STATES['visible'])
    this.setState({
      inTransition: inTransition,
      transitionState: state,
    })
    this.setOptions({
      inTransition: inTransition
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
    const { children } = this.props

    return (
      <Location>
        {({ location }) => (
          <IntlProvider locale={getLocale(location)} messages={messages[getLocale(location)]}>
            <LayoutContext.Provider value={this.state}>
              <FullViewportHeight>

                <GlobalStyle />

                <ThemeProvider theme={Theme}>
                  <React.Fragment>
                    <TransitionPane
                      state={transitionState}
                      color={location.state && location.state.transitionColor !== undefined ? location.state.transitionColor : '#000'}
                      title={location.state && location.state.transitionTitle !== undefined ? location.state.transitionTitle : 'Mill3'}
                    />

                    <Scrollbar
                      ref={this.scrollbarRef}
                      damping={0.0625}
                      renderByPixels={true}
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
                            delay={{ enter: TRANSITION_DURATION * 2 }}
                            timeout={{ exit: TRANSITION_DURATION }}
                            onExit={e => {
                              this.setTransitionState(TRANSITION_PANE_STATES['visible'])
                            }}
                            onEntering={e => {
                              this.scrollToTop()
                              this.setTransitionState(TRANSITION_PANE_STATES['hidden'])
                            }}
                            onEnter={e => {
                              this.setTransitionState(TRANSITION_PANE_STATES['ended'])
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
  introComponent: null,
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  withIntro: PropTypes.bool,
}

export default Layout
