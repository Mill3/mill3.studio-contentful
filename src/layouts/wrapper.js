import React from 'react'
import styled from 'styled-components'

const WrapperStyle = styled.div`
  height: 100vh;
  max-width: 100vw;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
`

const Wrapper = ({ children, ...props}) => (
  <WrapperStyle {...props}>
    { children }
  </WrapperStyle>
)

export default Wrapper
