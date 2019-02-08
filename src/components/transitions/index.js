import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import { TransitionState } from "gatsby-plugin-transition-link"

const TransitionPaneStyle = styled.div`
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
  transition: opacity 0.5s;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : `block`};
  opacity: ${props => props.visible ? 1 : 0};
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
              visible={['exiting', 'exited', 'entering'].includes(transitionStatus) ? true : false}
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