import React from "react"

export const defaultContextValue = {
  options: {
    withIntro: false,
    headerIntroComponent: null,
    transitionTitle: `Mill3`,
    transitionColor: `#0000ff`
  },
  set: () => {},
}

const LayoutContext = React.createContext(defaultContextValue);

export default LayoutContext