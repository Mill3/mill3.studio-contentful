import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { Box } from 'rebass'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { ThemeProvider } from 'styled-components'
import { Transition, TransitionGroup } from 'react-transition-group'
import SmoothScrollbar from 'smooth-scrollbar'

import ScrollbarPausePlugin from '@utils/ScrollbarPausePlugin'
import ScrollbarDirectionPlugin from '@utils/ScrollbarDirectionPlugin'
import ScrollbarEasePlugin from '@utils/ScrollbarEasePlugin'

import { defaultContextValue, reducer, LayoutContext } from '@layouts/layoutContext'

import Header from '@components/header'
import Footer from '@components/footer'
import TransitionPane from '@components/transitions'
import BodyBackground from '@layouts/body-background'
import Wrapper from '@layouts/wrapper'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

import { IS_TOUCH_DEVICE } from '@utils/constants';
//import DelayedTransition from '@utils/DelayedTransition'
import FullViewportHeight from '@utils/FullViewportHeight'
import Viewport from '@utils/Viewport'

SmoothScrollbar.use(ScrollbarPausePlugin, ScrollbarDirectionPlugin, ScrollbarEasePlugin)

const SCROLL_EVENT = typeof window === `object` ? new Event('scroll') : null
//const DELAY = { enter: 1 }
const TIMEOUT = { exit: 1 }

const Layout = ({ children }) => {
  const [layoutState, dispatch] = useReducer(reducer, defaultContextValue)
  const scrollbarRef = useRef()

  const onScroll = useCallback(() => {
    if ( Viewport.exists ) window.dispatchEvent(SCROLL_EVENT)
  })

  const initScrollbar = useCallback(() => {
    const options = {
      damping: IS_TOUCH_DEVICE ? 0.1 : 0.0625,
      renderByPixels: true,
      syncCallbacks: true,
      alwaysShowTracks: false,
      continuousScrolling: true,
    }
    const scrollbarInstance = SmoothScrollbar.init(scrollbarRef.current, options)
    dispatch({ type: 'scrollbar.set', scrollbar: scrollbarInstance })
    scrollbarInstance.addListener(onScroll)
  })

  const scrollToTop = useCallback(() => {
    const { scrollbar } = layoutState
    if (scrollbar) scrollbar.scrollTo(0, 0)
  })

  const onExit = useCallback(() => {
    dispatch({ type: 'inverted.reset' })
    scrollToTop()
  })

  const onEntering = useCallback(() => {
    dispatch({ type: 'transition.setState', transitionState: `entering`, inTransition: false })
  })

  useEffect(() => {
    if (!layoutState.scrollbar) initScrollbar()
  }, [scrollbarRef, layoutState.scrollbar])

  return (
    <Location>
      {({ location }) => (
          <LayoutContext.Provider value={{ layoutState, dispatch }}>
            <GlobalStyle />
            <ThemeProvider theme={Theme}>
              <BodyBackground />
              <TransitionPane />
              <FullViewportHeight>
                <div ref={scrollbarRef}>
                  <Wrapper>
                    {/* main header */}
                    <Header />

                    {/* main wrapper containing children pages */}
                    <TransitionGroup component="main">
                      <Transition
                        key={location.pathname}
                        name={location.pathname}
                        mountOnEnter={true}
                        unmountOnExit={true}
                        timeout={TIMEOUT}
                        onExit={onExit}
                        onEntering={onEntering}
                      >
                        <Box pt={6}>{children}</Box>
                      </Transition>

                      {/*
                      <DelayedTransition
                        key={location.pathname}
                        name={location.pathname}
                        mountOnEnter={true}
                        unmountOnExit={true}
                        delay={DELAY}
                        timeout={TIMEOUT}
                        onExit={onExit}
                        onEntering={onEntering}
                      >
                        <Box pt={6}>{children}</Box>
                      </DelayedTransition>
                      */}

                    </TransitionGroup>

                    {/* footer */}
                    <Footer />
                  </Wrapper>
                </div>
              </FullViewportHeight>
            </ThemeProvider>

            {/* debugging */}
          </LayoutContext.Provider>
      )}
    </Location>
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

export default React.memo(Layout)
