import React from "react"

export const defaultContextValue = {
  inTransition: true,
  options: {
    inverted: false
  },
  set: () => {},
}

const LayoutContext = React.createContext(defaultContextValue);

export default LayoutContext
