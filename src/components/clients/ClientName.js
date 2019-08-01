import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import TransitionLinkComponent from '@components/transitions/TransitionLink'

export const ClientNameHeading = styled.h4`
  display: inline-block;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;

  a {
    color: black;
    &:hover {
      color: black;
      text-decoration: none;
    }
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
        <TransitionLinkComponent to={`/projects/`} title={`Work, work, work, work!`} color={`#000`}>
          <span>{this.props.name}</span>
        </TransitionLinkComponent>
      </Text>
    )
  }
}

export default ClientName;
