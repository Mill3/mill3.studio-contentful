import React from "react"

export const defaultContextValue = {
  inTransition: true,
  demoReel: {
    active: false,
    trigger: null,
  },
  options: {
    inverted: false,
  },
  set: () => {},
  setDemoReel: () => {},
}

const LayoutContext = React.createContext(defaultContextValue);

export default LayoutContext
