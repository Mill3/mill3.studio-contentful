import React from 'react'
import DisplayState from './DisplayState'
import { TunnelProvider, TunnelPlaceholder, Tunnel } from 'react-tunnels'

export default props => (
  <TunnelProvider>
    <>
      {props.children}
      <TunnelPlaceholder id="transition-pane" multiple>
        {({ items }) => items.map(({ children }) => <span>{children}</span>)}
      </TunnelPlaceholder>
    </>
  </TunnelProvider>
)
