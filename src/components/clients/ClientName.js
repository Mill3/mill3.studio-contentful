import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

export const ClientNameHeading = styled.h4`
  display: inline-block;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  cursor: crosshair;
  transition: color 1s;
  &:hover {
    color: ${props => props.hoverColor ? props.hoverColor : props.theme.colors.blue};
  }
`

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

  render() {
    return (
      <Text
          as={ClientNameHeading}
          hoverColor={this.props.color}
          fontSize={['12.5vw',4,'8vw']}
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
