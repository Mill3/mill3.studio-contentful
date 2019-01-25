import React from 'react'
import styled, { keyframes } from 'styled-components'
import { TransitionState } from 'gatsby-plugin-transition-link'

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

const pickAnimation = (transitionStatus) => {
  switch (transitionStatus) {
    case 'entered':
      return entering
      break
    case 'entering':
      return entering
      break
    case 'exiting':
      return exiting
      break
  }
}

const Main = ({children}) => {
  return (
    <TransitionState>
      {({ transitionStatus }) => {
        return (
          <MainStyle keyframeName={pickAnimation(transitionStatus)}>
            {children}
          </MainStyle>
        )
      }}
    </TransitionState>
  )
}

export default Main