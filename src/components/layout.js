import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
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

import { TRANSITION_DURATION, TRANSITION_OUT_DURATION } from '@utils/constants'
import DelayedTransition from '@utils/DelayedTransition'
import FullViewportHeight from '@utils/FullViewportHeight'

const messages = { en, fr }
const SCROLL_EVENT = typeof window === 'object' ? new Event('scroll') : null

addLocaleData([...enData, ...frData])

export const getLocale = (location) => {
  return location.pathname.split('/')[1]
}

class Layout extends React.Component {

  static childContextTypes = {
    layoutState: PropTypes.object
  };

  constructor(props) {
    super(props)

    this.setOptions = this.setOptions.bind(this)
    this.setTransitionState = this.setTransitionState.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)

    this.state = {
      ...defaultContextValue,
      transitionState: TRANSITION_PANE_STATES['intro'],
      set: this.setOptions,
    }

    this.scrollbarRef = createRef()
  }

  getChildContext() {
    return {
      layoutState: this.state
    };
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
    let inTransition = state === TRANSITION_PANE_STATES['visible']
    this.setState({
      inTransition: inTransition,
      transitionState: state
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
                      transitionState={transitionState}
                      location={location}
                      color={location.state && location.state.transitionColor !== undefined ? location.state.transitionColor : '#121212'}
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

                              // revent to original transition state
                              // TODO: refactor me..
                              // setTimeout( () => {
                              //   this.setTransitionState(TRANSITION_PANE_STATES['ended'])
                              // }, TRANSITION_DURATION);
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
