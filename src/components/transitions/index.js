// TODO: TO REMOVE, THIS COMPONENT IS DEPRECATED
import React from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Text } from 'rebass'
import { TransitionState } from "gatsby-plugin-transition-link"

import {
  TRANSITION_DURATION,
  TRANSITION_DELAY,
  TRANSITION_EXIT_DURATION
} from '@utils/constants'

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

function print_r(o) {
  if (typeof window === `undefined`) return

  return JSON.stringify(o, null, '\t')
    .replace(/\n/g, '<br>')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
}

function DisplayState() {
  return (
    <TransitionState>
      {context =>
        context ? (
          <>{console.log(context)}</>
        ) : null
      }
    </TransitionState>
  )
}

class TransitionPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = {  }
  }

  render() {
    return (
      <TransitionState>
        {({ transitionStatus, entry, exit }) => {
          return (
            <TransitionPaneStyle
              backgroundColor={entry.state.transitionColor || exit.state.transitionColor}
              initialPose={`init`}
              pose={['exiting', 'exited', 'entering'].includes(transitionStatus) ? 'visible' : 'hidden'}
            >
              {/* <DisplayState /> */}
              <Text fontSize={[2,3,`5vw`]} className={`is-sans fw-300`}>{entry.state.transitionTitle}</Text>
            </TransitionPaneStyle>
          )
        }}
      </TransitionState>
    )
  }
}

export default TransitionPane