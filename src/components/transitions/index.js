import React from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Text } from 'rebass'

import Logo from '@svg/Logo'

import { EASES, TRANSITION_DURATION, TRANSITION_IN_DELAY, TRANSITION_OUT_DURATION } from '@utils/constants'

export const TRANSITION_PANE_STATES = {
  init: 'init',
  intro: 'intro',
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
  // intro site load
  intro: {
    y: `-110%`,
    delay: TRANSITION_IN_DELAY,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION,
      },
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
  // when everything has finished
  // (duration is set to 0 because we don't want the user to see any animation to this pose)
  ended: {
    opacity: 0,
    y: 0,
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
  background: ${props => props.backgroundColor};

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

class TransitionPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pose: TRANSITION_PANE_STATES['intro']
    }
    this.changePose = this.changePose.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    // change state only if transitionState props has changed
    if (prevProps.transitionState !== this.props.transitionState) {
      this.changePose(this.props.transitionState)
    }
  }

  // method for switching active pose
  changePose(pose) {
    this.setState({
      pose: pose
    })
  }

  render() {
    const { color, title } = this.props
    const { pose } = this.state

    return (
      <Flex
        // className="full-vh"
        as={TransitionPaneStyle}
        p={'4vw'}
        justifyContent={'center'}
        alignItems={'center'}
        backgroundColor={color}
        initialPose={TRANSITION_PANE_STATES[`init`]}
        pose={pose}
        onPoseComplete={poseName => {
          // after `intro` or `hidden` pose, revert pane style and position
          // console.log('poseName:', poseName)
          if (poseName === (TRANSITION_PANE_STATES['intro'] || TRANSITION_PANE_STATES['hidden'])) {
            this.changePose(TRANSITION_PANE_STATES['ended'])
          }
        }}
      >
        <Text
          as={TransitionTextStyle}
          fontSize={['18vw', null, `5vw`]}
          textAlign="center"
          lineHeight="1.1"
          className={`is-sans fw-300`}
        >
          {pose === TRANSITION_PANE_STATES['intro'] ? <Logo inverted /> : <span>{title}</span>}
        </Text>
      </Flex>
    )
  }
}

export default TransitionPane
