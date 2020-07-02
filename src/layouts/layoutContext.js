import { createContext } from "react"

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
    step: 0,
    transitionColor: '#121212',
    transitionTitle: null
  },
  scrollbar: null
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'transition.setState':
      return {
        ...state,
        transition: {
          ...state.transition,
          state: action.transitionState,
          inTransition: action.inTransition
        },
      }
    case 'transition.linkState':
      return {
        ...state,
        transition: {
          ...state.transition,
          transitionColor: action.transitionColor,
          transitionTitle: action.transitionTitle
        },
      }
    case 'header.invert':
      if( state.invertedHeader === true ) return state
      else return { ...state, invertedHeader: true }
    case 'header.reset':
      if( state.invertedHeader === false ) return state
      else return { ...state, invertedHeader: false }
    case 'body.invert':
      if( state.invertedBody === true ) return state
      else return { ...state, invertedBody: true }
    case 'body.reset':
      if( state.invertedBody === false ) return state
      else return { ...state, invertedBody: false }
    // single dispatch for inverting body and nav
    case 'inverted.set':
      if( state.invertedHeader === true && state.invertedBody === true ) return state
      else return { ...state, invertedHeader: true, invertedBody: true }
    // single dispatch for reverting inverted body and nav
    case 'inverted.reset':
      if( state.invertedHeader === false && state.invertedBody === false ) return state
      else return { ...state, invertedHeader: false, invertedBody: false }
    case 'scrollbar.set':
      return {
        ...state,
        scrollbar: action.scrollbar
      }
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
          active: false,
        },
      }
    default:
      return {
        ...state,
      }
  }
}

export const LayoutContext = createContext()