import React, { createContext, useReducer } from "react"
// import { TransitionState } from 'gatsby-plugin-transition-link'


export const defaultContextValue = {
  count: true,
  inTransition: true,
  invertedHeader: false,
  invertedBody: false,
  demoReel: {
    active: false,
    trigger: null,
  },
  // set: () => {},
  // setDemoReel: () => {},
  // setInverted: () => {},
}

const LayoutContext = createContext();

const reducer = (state, action) => {
  // console.log('state, action:', state, action)
  switch (action.type) {
    case 'increment':
      return { ...state, count: true};
    case 'decrement':
      return { ...state, count: false};
    default:
      throw new Error();
  }
}

// const LayoutProvider = ( { children } ) => {
//   const [state, dispatch] = useReducer(reducer, defaultContextValue);
//   console.log('state, dispatch:', state, dispatch)
//   return <Provider value={{ state, dispatch }}>{children}</Provider>;
// };

// console.log(LayoutProvider);

// export default LayoutContext

export { LayoutContext, reducer }
