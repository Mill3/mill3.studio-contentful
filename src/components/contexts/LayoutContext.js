import React from "react"

export const defaultContextValue = {
  inTransition: true,
  invertedHeader: false,
  demoReel: {
    active: false,
    trigger: null,
  },
  // options: {
  //   inverted: false,
  // },
  set: () => {},
  setDemoReel: () => {},
  setInverted: () => {},
}

const LayoutContext = React.createContext(defaultContextValue);

export default LayoutContext
