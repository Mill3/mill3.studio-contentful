import React from 'react'
import styled, { keyframes } from 'styled-components'

const entering = keyframes`
  to {
    opacity: 1;
  }
`

const exiting = keyframes`
  to {
    opacity: 0;
  }
`

const MainStyle = styled.main`
  opacity: 0;
  animation-name: ${props => props.keyframeName};
  animation-duration: 1s;
  animation-fill-mode: forwards;
`

const Main = ({ children }) => {
  return <MainStyle keyframeName={entering}>{children}</MainStyle>
}

export default Main