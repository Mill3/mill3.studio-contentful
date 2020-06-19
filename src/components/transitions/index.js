import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Text } from 'rebass'

import LogoAnimated from '@svg/LogoAnimated'

import { LayoutContext } from '@layouts/layoutContext'

import {
  TRANSITION_INTRO_DELAY,
  TRANSITION_DURATION,
  TRANSITION_IN_DELAY,
  // TRANSITION_OUT_DELAY,
  TRANSITION_OUT_DURATION,
} from '@utils/constants'

export const TRANSITION_PANE_STATES = {
  init: 'init',
  intro: 'intro',
  exited: 'visible',
  exiting: 'visible',
  entering: 'visible',
  visible: 'visible',
  ended: 'ended',
  entered: 'hidden',
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
    delay: TRANSITION_INTRO_DELAY,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION,
      },
    },
  },

  // when transition start
  exit: {
    opacity: 0,
    transition: {
      delay: TRANSITION_OUT_DURATION,
      duration: TRANSITION_OUT_DURATION,
    },
  },

  // when page change starts
  exiting: {
    opacity: 1,
    transition: {
      delay: TRANSITION_OUT_DURATION,
      duration: TRANSITION_OUT_DURATION,
      ease: 'easeOut',
    },
  },

  // when new page is enter
  enter: {
    opacity: 1,
  },

  // when new page is entering
  entering: {
    opacity: 0,
    transition: {
      duration: TRANSITION_OUT_DURATION,
      ease: 'easeIn',
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
    @media (max-width: ${props => props.theme.breakpoints[1]}) {
      transform: translateY(-7vh);
    }
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

const transitionPropsDefaults = { transitionColor: `#121212`, transitionTitle: null }

const TransitionPane = ({ location }) => {
  const { layoutState, dispatch } = useContext(LayoutContext)
  const { transition } = layoutState
  const [pose, setPose] = useState(transition.state)
  const { transitionColor, transitionTitle } = location.state || transitionPropsDefaults

  useEffect(() => {
    // console.log('transitionColor, transitionTitle:', transitionColor, transitionTitle)
    setPose(transition.state)
  }, [layoutState, transition])

  return (
    <Flex
      as={TransitionPaneStyle}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={transitionColor}
      opacity={1}
      initialPose={`init`}
      pose={pose}
      onPoseComplete={poseName => {
        // after `intro` or `hidden` pose, revert pane style and position
        if (poseName === `intro`) {
          dispatch({ type: 'transition.setState', transitionState: `ended`, inTransition: false })
        }
      }}
    >
      {/* when in intro state */}
      {pose === `intro` && <LogoAnimated inverted={true} animated={true} />}

      {/* not intro, has a transitionTitle */}
      {(pose !== `intro` && transitionTitle) && (
        <Text
          as={TransitionTextStyle}
          fontSize={['18vw', null, `5vw`]}
          textAlign="center"
          lineHeight="1.1"
          className={`is-sans fw-300`}
        >
          <span>{transitionTitle}</span>
        </Text>
      )}
    </Flex>
  )
}

export default TransitionPane


