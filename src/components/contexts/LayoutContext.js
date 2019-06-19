import React from "react"

export const defaultContextValue = {
  options: {
    withIntro: false,
    headerIntroComponent: null
  },
  set: () => {},
}

const LayoutContext = React.createContext(defaultContextValue);

export default LayoutContext