import React from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Text } from 'rebass'
import { TransitionState } from "gatsby-plugin-transition-link"

const Poses = posed.div({
  init: {
    opacity: 0,
    backgroundColor: '#000'
  },
  visible: {
    opacity: 1,
    backgroundColor: ({ backgroundColor }) => backgroundColor,
    transition: {
      duration: 500
    }
  },
  hidden: {
    opacity: 0,
    backgroundColor: ({ backgroundColor }) => backgroundColor,
    transition: {
      duration: 500
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

class TransitionPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = {  }
  }

  componentDidMount() {
    // console.log( Consumer);
  }

  render() {
    return (
      <TransitionState>
        {({ transitionStatus, entry, exit }) => {
          return (
            <TransitionPaneStyle
              backgroundColor={entry.state.transitionColor}
              initialPose={`init`}
              pose={['exiting', 'exited', 'entering'].includes(transitionStatus) ? 'visible' : 'hidden'}
            >
              <Text fontSize={[2,3,`5vw`]} className={`is-sans fw-300`}>{entry.state.transitionTitle}</Text>
            </TransitionPaneStyle>
          )
        }}
      </TransitionState>
    )
  }
}

export default TransitionPane