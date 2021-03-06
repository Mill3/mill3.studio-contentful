import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { Box } from 'rebass'
import PropTypes from 'prop-types'
import { useLocation } from '@reach/router'
import { ThemeProvider } from 'styled-components'
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

import { IS_TOUCH_DEVICE, TRANSITION_PANE_STATES } from '@utils/constants';
import FullViewportHeight from '@utils/FullViewportHeight'
import Viewport from '@utils/Viewport'

SmoothScrollbar.use(ScrollbarPausePlugin, ScrollbarDirectionPlugin, ScrollbarEasePlugin)

const SCROLL_EVENT = typeof window === `object` ? new Event('scroll') : null

const Layout = ({ children }) => {
  const location = useLocation()
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


  useEffect(() => {
    if (!layoutState.scrollbar) initScrollbar()
  }, [scrollbarRef, layoutState.scrollbar])


  // scroll to top && reset layoutContext when location change
  // we can't use useEffect because it is triggered after new page first useEffect
  const pathname = useMemo(() => {
    if( layoutState.transition.state !== TRANSITION_PANE_STATES['intro'] ) {
      dispatch({ type: 'inverted.reset' })
      scrollToTop()
    }    

    return location.pathname
  }, [location.pathname])

  return (
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
              <Box as="main" pt={6}>{children}</Box>

              {/* footer */}
              <Footer />
            </Wrapper>
          </div>
        </FullViewportHeight>
      </ThemeProvider>

      {/* debugging */}
    </LayoutContext.Provider>
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
