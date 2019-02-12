import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'

const ClientNameHeading = styled.h4`
  display: inline-block;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  cursor: crosshair;
  transition: color 1s;
  &:hover {
    color: ${props => props.theme.colors.purple};
  }
`

const ClientNameCharPoses = {
  init: {
    y: 0,
    delay: ({ charIndex }) => charIndex * 50,
  },
  hover: {
    y: -15,
    delay: ({ charIndex }) => charIndex * 50,
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 0.125,
    }
  }
};

class ClientName extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hover: false
    }
    this.hover = this.hover.bind(this)
  }

  hover(isHover) {
    this.setState({
      hover: isHover
    })
  }

  // animation() {
  //   return(
  //     <SplitText pose={'hover'} charPoses={ClientNameCharPoses}>
  //       {this.props.name}
  //     </SplitText>
  //   )
  // }

  render() {
    return (
      <Text
          as={ClientNameHeading}
          fontSize={[3,4,'8vw']}
          ml={[2,4]}
          mr={[2,4]}
          onMouseEnter={e => this.hover(true)}
          onMouseLeave={e => this.hover(false)}
        >
        <span>{this.props.name}</span>
      </Text>
    )
  }
}

export default ClientName;