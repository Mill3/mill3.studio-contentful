import React from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Text } from 'rebass'

import { TRANSITION_DURATION } from '@utils/constants'

const Poses = posed.div({
  init: {
    opacity: 0,
    backgroundColor: '#000'
  },
  visible: {
    opacity: 1,
    backgroundColor: ({ backgroundColor }) => backgroundColor ? backgroundColor : '#000',
    transition: {
      duration: (TRANSITION_DURATION / 2) * 1000
    }
  },
  hidden: {
    opacity: 0,
    backgroundColor: ({ backgroundColor }) => backgroundColor ? backgroundColor : '#000',
    transition: {
      duration: (TRANSITION_DURATION / 2) * 1000
    }
  }
})

const TransitionPaneStyle = styled(Poses)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: #fff;
`

const TransitionPane = ({ state = 'hidden', color, title, onEntered, onExited }) => {
  return (
    <TransitionPaneStyle backgroundColor={color} initialPose={`init`} pose={state}>
      <Text fontSize={[2,3,`5vw`]} className={`is-sans fw-300`}>{title}</Text>
    </TransitionPaneStyle>
  )
}

export default TransitionPane
