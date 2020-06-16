import React, { createRef, useRef, createContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { IntlProvider } from 'gatsby-plugin-intl'
import { ThemeProvider } from 'styled-components'
import { TransitionGroup } from 'react-transition-group'
import { TransitionState, TransitionPortal } from 'gatsby-plugin-transition-link'
import SmoothScrollbar from 'smooth-scrollbar'
import Scrollbar from 'react-smooth-scrollbar'

import ScrollbarPausePlugin from '@utils/ScrollbarPausePlugin'
import ScrollbarDirectionPlugin from '@utils/ScrollbarDirectionPlugin'

// Locale data
// import enData from 'react-intl/locale-data/en'
// import frData from 'react-intl/locale-data/fr'

// messages
import en from '@locales/en.json'
import fr from '@locales/fr.json'

import { getLocale } from '@utils/Locales'

import Header from '@components/header'
// import Footer from '@components/footer'
import TransitionPane, { TRANSITION_PANE_STATES } from '@components/transitions'
import Wrapper from '@layouts/wrapper'

import GlobalStyle from '@styles/Global'
import Theme from '@styles/Theme'

// import { TRANSITION_DURATION } from '@utils/constants'
// import DelayedTransition from '@utils/DelayedTransition'
import FullViewportHeight from '@utils/FullViewportHeight'

const messages = { en, fr }
const SCROLL_EVENT = typeof window === 'object' ? new Event('scroll') : null

SmoothScrollbar.use(ScrollbarPausePlugin, ScrollbarDirectionPlugin)

export const defaultContextValue = {
  count: null,
  invertedHeader: false,
  invertedBody: false,
  demoReel: {
    active: false,
    trigger: null,
  },
  transition: {
    inTransition: false,
    state: 'intro',
  },
  scrollbar: null,
  getScrollbar: () => {}
}

export const LayoutContext = createContext()

export const reducer = (state, action) => {
  switch (action.type) {
    case 'transition.setState':
      return {
        ...state,
        transition: {
          inTransition: action.inTransition,
          state: action.transitionState,
        },
      }
    case 'header.invert':
      return { ...state, invertedHeader: true }
    case 'header.reset':
      return { ...state, invertedHeader: false }
    case 'body.invert':
      return { ...state, invertedBody: true }
    case 'body.reset':
      return { ...state, invertedBody: false }
    case 'scrollbar.set':
      return { ...state, scrollbar: action.scrollbar, getScrollbar: () => { return action.scrollbar } }
    case 'demoReel.start':
      return {
        ...state,
        demoReel: {
          active: true,
          trigger: action.trigger,
        },
      }
    case 'demoReel.stop':
      return {
        ...state,
        demoReel: {
          active: false
        },
      }
    default:
      return {
        ...state,
      }
  }
}

const Layout = props => {
  const [layoutState, dispatch] = useReducer(reducer, defaultContextValue)
  const { children } = props
  const scrollbarRef = useRef()

  const onScroll = () => {
    if (SCROLL_EVENT) window.dispatchEvent(SCROLL_EVENT)
  }

  const initScrollbar = () => {
    const scrollbarInstance = SmoothScrollbar.init(scrollbarRef.current, {damping: 0.0625, onScroll: onScroll});
    dispatch({type: 'scrollbar.set', scrollbar: scrollbarInstance})
    scrollbarInstance.addListener(onScroll)
  }

  useEffect(() => {
    if(!layoutState.scrollbar) initScrollbar()
  }, [scrollbarRef]);

  return (
    <Location>
      {({ location }) => (
        <>
          <GlobalStyle inverted={layoutState.invertedBody} />
          <LayoutContext.Provider value={{ layoutState, dispatch }}>
            <ThemeProvider theme={Theme}>
              <TransitionPane location={location} />
              <FullViewportHeight>
                <div
                  ref={scrollbarRef}
                  damping={0.0625}
                  renderByPixels={true}
                  syncCallbacks={true}
                  alwaysShowTracks={false}
                  continuousScrolling={true}
                  onScroll={onScroll}
                >
                  <Wrapper>
                    {/* main header */}
                    <Header />
                    {/* current page */}
                    {children}
                    {/* footer */}
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

// class Layout extends React.Component {
//   // static childContextTypes = {
//   //   layoutState: PropTypes.object,
//   // }

//   constructor(props) {
//     super(props)

//     // this.setDemoReel = this.setDemoReel.bind(this)
//     // this.setHeaderInverted = this.setHeaderInverted.bind(this)
//     // this.setBodyInverted = this.setBodyInverted.bind(this)
//     // this.setTransitionState = this.setTransitionState.bind(this)
//     // this.onScroll = this.onScroll.bind(this)
//     // this.scrollToTop = this.scrollToTop.bind(this)

//     // this.state = {
//     //   ...defaultContextValue,
//     //   transitionState: TRANSITION_PANE_STATES['intro'],
//     //   setDemoReel: this.setDemoReel,
//     //   setHeaderInverted: this.setHeaderInverted,
//     //   setBodyInverted: this.setBodyInverted,
//     // }

//     this.scrollbarRef = createRef()
//   }

//   // getChildContext() {
//   //   return {
//   //     layoutState: this.state,
//   //   }
//   // }

//   // setDemoReel(active = false, trigger = null) {
//   //   this.setState(state => ({
//   //     demoReel: {
//   //       active,
//   //       trigger,
//   //     },
//   //   }))
//   // }

//   // setHeaderInverted(inverted = false) {
//   //   this.setState(state => ({
//   //     invertedHeader: inverted,
//   //   }))
//   // }

//   // setBodyInverted(inverted = false, ref = null) {
//   //   this.setState(state => ({
//   //     invertedBody: inverted,
//   //     invertedBodyRef: ref,
//   //   }))
//   // }

//   // setTransitionState(state) {
//   //   let inTransition = state === TRANSITION_PANE_STATES['visible']
//   //   this.setState({
//   //     inTransition: inTransition,
//   //     transitionState: state,
//   //     options: {
//   //       ...this.state.options,
//   //     },
//   //   })
//   // }

//   // onScroll() {
//   //   if (SCROLL_EVENT) window.dispatchEvent(SCROLL_EVENT)
//   // }

//   // scrollToTop() {
//   //   if (!this.scrollbarRef || !this.scrollbarRef.current || !this.scrollbarRef.current.scrollbar) return

//   //   this.scrollbarRef.current.scrollbar.scrollTo(0, 0)
//   // }

//   render() {
//     const [state, dispatch] = useReducer(reducer, defaultContextValue);
//     // const { transitionState } = this.state
//     const { children } = this.props
//     // console.log('this.props:', this.props)

//     // this is for 404 page
//     // if (pageContext.layout === 'basic') {
//     //   return (
//     //     <React.Fragment>
//     //       <GlobalStyle />
//     //       <ThemeProvider theme={Theme}>{children}</ThemeProvider>
//     //     </React.Fragment>
//     //   )
//     // }

//     // return (
//     //   <Location>
//     //     {({ location }) => (
//     //       <div>
//     //         <IntlProvider
//     //           locale={pageContext.locale || getLocale(location)}
//     //           messages={messages[pageContext.locale || getLocale(location)]}
//     //         >
//     //           <LayoutContext.Provider value={this.state}>
//     //             {/* {console.log(location, this.props)} */}
//     //             <FullViewportHeight>
//     //               <GlobalStyle inverted={this.state.invertedBody} />
//     //               <ThemeProvider theme={Theme}>
//     //                 <Scrollbar
//     //                   ref={this.scrollbarRef}
//     //                   damping={0.0625}
//     //                   renderByPixels={true}
//     //                   syncCallbacks={true}
//     //                   alwaysShowTracks={false}
//     //                   continuousScrolling={true}
//     //                   onScroll={this.onScroll}
//     //                 >
//     //                   <Wrapper>
//     //                     {/* main header */}
//     //                     <Header />
//     //                     {/* current page children */}
//     //                     <div>{children}</div>
//     //                     {/* footer */}
//     //                     <Footer />
//     //                   </Wrapper>
//     //                 </Scrollbar>
//     //               </ThemeProvider>
//     //               <DisplayState />
//     //             </FullViewportHeight>
//     //           </LayoutContext.Provider>
//     //         </IntlProvider>
//     //       </div>
//     //     )}
//     //   </Location>
//     // )
//   }
// }

Layout.defaultProps = {
  withIntro: false,
  introComponent: null,
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  withIntro: PropTypes.bool,
}

export default Layout
