import React from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Text } from 'rebass'

import Logo from '@svg/Logo'

import { TRANSITION_DURATION, TRANSITION_IN_DELAY, TRANSITION_OUT_DURATION } from '@utils/constants'

export const TRANSITION_PANE_STATES = {
  initial: 'initial',
  exiting: 'exiting',
  visible: 'visible',
  ended: 'ended',
  hidden: 'hidden',
}

const Poses = posed.div({
  // default state with no pose
  init: {
    opacity: 1,
  },
  // initial site load
  initial: {
    opacity: 0,
    transition: {
      delay: TRANSITION_DURATION,
      duration: TRANSITION_DURATION / 2,
      ease: 'easeInOut',
    },
  },
  // when page change starts
  visible: {
    opacity: 1,
    transition: {
      delay: TRANSITION_IN_DELAY,
      duration: TRANSITION_DURATION - TRANSITION_IN_DELAY,
      ease: 'easeOut',
    },
  },
  // when page change ends
  hidden: {
    opacity: 0,
    transition: {
      duration: TRANSITION_OUT_DURATION,
      ease: 'easeIn',
    },
  },
  //
  ended: {
    opacity: 0,
    transition: {
      duration: 0,
    },
  },
})

const TransitionPaneStyle = styled(Poses)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 105vh;
  z-index: 100000;
  pointer-events: none;
  color: #fff;
  background: ${props => props.backgroundColor || '#000'};

  svg {
    width: 88vw;
  }

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    height: 100vh;
  }

`
const TransitionTextStyle = styled.p`
  mix-blend-mode: difference;
  @media (max-width: ${props => props.theme.breakpoints[1]}) {
    transform: translateY(-7vh);
  }
`

const TransitionPane = ({ state = 'initial', color, title }) => {

  return (
    <Flex
      as={TransitionPaneStyle}
      // className="full-vh"
      p={'4vw'}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={color}
      initialPose={`init`}
      pose={state}
    >
      <Text
        as={TransitionTextStyle}
        fontSize={['18vw', null, `5vw`]}
        textAlign="center"
        lineHeight="1.1"
        className={`is-sans fw-300`}
      >
        {state === TRANSITION_PANE_STATES['initial'] ? <Logo inverted /> : <span>{title}</span>}
      </Text>
    </Flex>
  )
}

export default TransitionPane
