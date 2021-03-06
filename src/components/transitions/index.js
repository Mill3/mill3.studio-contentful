import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Text } from 'rebass'
import { navigate } from 'gatsby'

import LogoAnimated from '@svg/LogoAnimated'

import { LayoutContext } from '@layouts/layoutContext'

import {
  TRANSITION_PANE_STATES,
  TRANSITION_INTRO_DELAY,
  TRANSITION_INTRO_DURATION,
  TRANSITION_IN_DELAY,
  TRANSITION_IN_DURATION,
  TRANSITION_OUT_DELAY,
  TRANSITION_OUT_DURATION,
} from '@utils/constants'


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
        duration: TRANSITION_INTRO_DURATION,
      },
    },
  },

  // when transition starts
  leaving: {
    opacity: 1,
    transition: {
      delay: TRANSITION_OUT_DELAY,
      duration: TRANSITION_OUT_DURATION,
    },
  },

  // when new page is entering and transition is ending
  entering: {
    opacity: 0,
    transition: {
      type: 'tween',
      delay: TRANSITION_IN_DELAY,
      duration: TRANSITION_IN_DURATION,
      ease: 'linear',
    },
  },

  // when page transition started, initial state after intro and first visited paged
  // (duration is set to 0 because we don't want the user to see any animation to this pose)
  started: {
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

const TransitionPane = () => {
  const { layoutState, dispatch } = useContext(LayoutContext)
  const { transition } = layoutState
  const { state, transitionColor, transitionTitle } = transition
  const [pose, setPose] = useState(TRANSITION_PANE_STATES[state])

  const onPoseComplete = useCallback((poseName) => {
    // after `intro` or `hidden` pose, revert pane style and position
    if (poseName === TRANSITION_PANE_STATES[`intro`]) {
      dispatch({ type: 'transition.setState', transitionState: `started`, inTransition: false })
    }

    // after `leaving` transition (showing TransitionPane), navigate to new page
    if (poseName === TRANSITION_PANE_STATES[`leaving`]) {
      navigate(transition.transitionPath)
      dispatch({ type: 'transition.setState', transitionState: 'entering', inTransition: true })
    }

    // after `entering` transition (hiding TransitionPane), start new in page appear animations
    if (poseName === TRANSITION_PANE_STATES[`entering`]) {
      dispatch({ type: 'transition.setState', transitionState: 'started', inTransition: false })
    }
  })

  useEffect(() => {
    setPose(TRANSITION_PANE_STATES[transition.state])
  }, [transition])

  return (
    <Flex
      as={TransitionPaneStyle}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={transitionColor}
      opacity={1}
      initialPose={`init`}
      pose={pose}
      onPoseComplete={onPoseComplete}
    >
      {/* when in intro state */}
      {pose === TRANSITION_PANE_STATES[`intro`] && <LogoAnimated inverted={true} animated={true} />}

      {/* not intro, has a transitionTitle */}
      {(pose !== TRANSITION_PANE_STATES[`intro`] && transitionTitle) && (
        <Text
          as={TransitionTextStyle}
          fontSize={[transitionTitle.length > 30 ? '12vw' : '18vw', null, `5vw`]}
          textAlign="center"
          lineHeight="1.1"
          className={`is-sans fw-300`}
          px={[2, null, 0]}
        >
          <span>{transitionTitle}</span>
        </Text>
      )}
    </Flex>
  )
}

export default React.memo(TransitionPane)


