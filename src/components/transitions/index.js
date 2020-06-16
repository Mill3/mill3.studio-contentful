import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TransitionState } from 'gatsby-plugin-transition-link'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Text } from 'rebass'

import LogoAnimated from '@svg/LogoAnimated'

import { LayoutContext } from "@layouts"

import {
  TRANSITION_INTRO_DELAY,
  TRANSITION_DURATION,
  TRANSITION_IN_DELAY,
  TRANSITION_OUT_DURATION,
} from '@utils/constants'

// console.log('LayoutContext:', LayoutContext)

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
  // when page change starts
  exiting: {
    opacity: 1,
    transition: {
      duration: TRANSITION_DURATION / 4,
      ease: 'easeOut',
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

const TransitionPane = ({ location }) => {
  const { layoutState, dispatch } = useContext(LayoutContext);
  const { transition } = layoutState;

  const pose = () => {
    return transition.state
  }

  useEffect(() => {
    if(transition.inTransition) {
      dispatch({type: "transition.setState", transitionState: `hidden`, inTransition: false})
      dispatch({type: "header.revert"})
      dispatch({type: "body.revert"})
    }
  }, [location]);

  return (
    <Flex
      as={TransitionPaneStyle}
      backgroundColor={'red'}
      opacity={1}
      initialPose={`init`}
      pose={pose()}
      onPoseComplete={poseName => {
        // after `intro` or `hidden` pose, revert pane style and position
        if (poseName === `intro`) {
          dispatch({type: "transition.setState", transitionState: `ended`})
        }
      }}
    ></Flex>
  )
}

export default React.memo(TransitionPane)

// class TransitionPane extends React.Component {

//   static childContextTypes = {
//     layoutState: PropTypes.object
//   };

//   constructor(props) {
//     super(props)
//     this.state = {
//       pose: TRANSITION_PANE_STATES['intro'],
//     }
//     this.changePose = this.changePose.bind(this)
//   }

//   getChildContext() {
//     return {
//       layoutState: this.state
//     };
//   }

//   componentDidUpdate(prevProps, prevState) {
//     // change state only if transitionState props has changed
//     if (prevProps.transitionState !== this.props.transitionState) {
//       this.changePose(this.props.transitionState)
//     }
//   }

//   // method for switching active pose
//   changePose(pose) {
//     this.setState({
//       pose: pose,
//     })
//   }

//   render() {
//     const { color, title } = this.props
//     const { pose } = this.state

//     return (
//       <Flex
//         // className="full-vh"
//         as={TransitionPaneStyle}
//         p={'4vw'}
//         justifyContent={'center'}
//         alignItems={'center'}
//         backgroundColor={color}
//         initialPose={TRANSITION_PANE_STATES[`init`]}
//         pose={pose}
//         onPoseComplete={poseName => {
//           // after `intro` or `hidden` pose, revert pane style and position
//           if (poseName === (TRANSITION_PANE_STATES['intro'] || TRANSITION_PANE_STATES['hidden'])) {
//             this.changePose(TRANSITION_PANE_STATES['ended'])
//           }
//         }}
//       >
//         {/* when in intro state */}
//         {pose === TRANSITION_PANE_STATES['intro'] &&
//           <LogoAnimated inverted={true} animated={true} />
//         }
//         {/* outside intro */}
//         {pose !== TRANSITION_PANE_STATES['intro'] &&
//           <Text
//             as={TransitionTextStyle}
//             fontSize={['18vw', null, `5vw`]}
//             textAlign="center"
//             lineHeight="1.1"
//             className={`is-sans fw-300`}
//           >
//             <span>{title}</span>
//           </Text>
//         }
//       </Flex>
//     )
//   }
// }

// export default TransitionPane
