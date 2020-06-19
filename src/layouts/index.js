import React, { useRef, useReducer, useEffect } from 'react'
import { Box } from 'rebass'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { ThemeProvider } from 'styled-components'
import { TransitionGroup } from 'react-transition-group'
import SmoothScrollbar from 'smooth-scrollbar'

import ScrollbarPausePlugin from '@utils/ScrollbarPausePlugin'
import ScrollbarDirectionPlugin from '@utils/ScrollbarDirectionPlugin'
import ScrollbarEasePlugin from '@utils/ScrollbarEasePlugin'

import { defaultContextValue, reducer, LayoutContext } from '@layouts/layoutContext'

import Header from '@components/header'
import Footer from '@components/footer'
import TransitionPane from '@components/transitions'
import Wrapper from '@layouts/wrapper'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

import { TRANSITION_DURATION, TRANSITION_OUT_DELAY } from '@utils/constants'
import DelayedTransition from '@utils/DelayedTransition'
import FullViewportHeight from '@utils/FullViewportHeight'

const SCROLL_EVENT = typeof window === 'object' ? new Event('scroll') : null

SmoothScrollbar.use(ScrollbarPausePlugin, ScrollbarDirectionPlugin, ScrollbarEasePlugin)

const Layout = props => {
  const [layoutState, dispatch] = useReducer(reducer, defaultContextValue)
  const { children } = props
  const scrollbarRef = useRef()

  const onScroll = () => {
    if (SCROLL_EVENT) window.dispatchEvent(SCROLL_EVENT)
  }

  const initScrollbar = () => {
    const options = {
      damping: 0.0625,
      renderByPixels: true,
      syncCallbacks: true,
      alwaysShowTracks: false,
      continuousScrolling: true,
    }
    const scrollbarInstance = SmoothScrollbar.init(scrollbarRef.current, options)
    dispatch({ type: 'scrollbar.set', scrollbar: scrollbarInstance })
    scrollbarInstance.addListener(onScroll)
  }

  const scrollToTop = () => {
    const { scrollbar } = layoutState
    if(!scrollbar) return
    scrollbar.scrollTo(0, 0)
  }

  useEffect(() => {
    if (!layoutState.scrollbar) initScrollbar()
  }, [scrollbarRef, layoutState])

  return (
    <Location>
      {({ location }) => (
        <>
          <LayoutContext.Provider value={{ layoutState, dispatch }}>
            <GlobalStyle inverted={layoutState.invertedBody} />
            <ThemeProvider theme={Theme}>
              <TransitionPane location={location} />
              <FullViewportHeight>
                <div ref={scrollbarRef}>
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
                          exiting: TRANSITION_DURATION,
                          enter: TRANSITION_DURATION,
                        }}
                        timeout={{
                          exit: TRANSITION_DURATION,
                          exiting: TRANSITION_DURATION,
                          enter: TRANSITION_DURATION,
                          entering: TRANSITION_DURATION
                        }}
                        onExit={e => {
                          console.warn(`1 exit`);
                          dispatch({ type: 'transition.setState', transitionState: `exit`, inTransition: true })
                        }}
                        onExiting={e => {
                          console.warn(`2 exiting`);
                          dispatch({ type: 'transition.setState', transitionState: `exiting`, inTransition: true })
                        }}
                        onEnter={e => {
                          console.warn(`3 enter`);
                          dispatch({type: "body.reset"})
                          dispatch({type: "header.reset"})
                          dispatch({ type: 'transition.setState', transitionState: `enter`, inTransition: true })
                          scrollToTop()
                        }}
                        onEntering={e => {
                          console.warn(`4. entering`);
                          dispatch({ type: 'transition.setState', transitionState: `entering`, inTransition: false })
                        }}
                      >
                        <Box pt={[6]}>
                          {children}
                        </Box>
                      </DelayedTransition>
                    </TransitionGroup>

                    {/* footer */}
                    <Footer />

                  </Wrapper>
                </div>
              </FullViewportHeight>
            </ThemeProvider>

            {/* debugging */}
          </LayoutContext.Provider>
        </>
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

export default Layout
