import React from "react"

export const defaultContextValue = {
  options: {
    inverted: false
  },
  set: () => {},
}

const LayoutContext = React.createContext(defaultContextValue);

export default LayoutContext
