import React, { useState } from 'react'
import { Location } from '@reach/router'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
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
import TransitionPane from '@components/transitions'
import Wrapper from '@components/wrapper'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

import DelayedTransition from '@utils/DelayedTransition'
import { TRANSITION_DURATION } from '@utils/constants'

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
    this.state = {
      ...defaultContextValue,
      inTransition: false,
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

  setTransitionState(value) {
    this.setState({
      inTransition: value,
    })
  }

  render() {
    const { inTransition } = this.state
    const { children } = this.props
    const locale = `en`
    const onScroll = () => {
      if (SCROLL_EVENT) window.dispatchEvent(SCROLL_EVENT)
    }
    return (
      <Location>
        {({ location }) => (
          <IntlProvider locale={getLocale(location)} messages={messages[getLocale(location)]}>
            <LayoutContext.Provider value={this.state}>
              <React.Fragment>
                {/* {console.log(location)} */}

                <GlobalStyle />

                <ThemeProvider theme={Theme}>
                  <React.Fragment>
                    <TransitionPane
                      state={inTransition ? 'visible' : 'hidden'}
                      color={location.state && location.state.transitionColor !== undefined ? location.state.transitionColor : '#000'}
                      title={location.state && location.state.transitionTitle !== undefined ? location.state.transitionTitle : 'Mill3'}
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
                        <Header />

                        {/* main wrapper containing children pages */}
                        <TransitionGroup component="main">
                          <DelayedTransition
                            key={location.pathname}
                            name={location.pathname}
                            appear={false}
                            mountOnEnter={true}
                            unmountOnExit={true}
                            delay={{ enter: TRANSITION_DURATION + 150 }}
                            timeout={{ exit: TRANSITION_DURATION }}
                            onEnter={e => this.setTransitionState(false)}
                            onExit={e => this.setTransitionState(true)}
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
