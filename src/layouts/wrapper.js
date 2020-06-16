import React, { Component } from 'react'
import styled from 'styled-components'

const WrapperStyle = styled.div`
  height: 100vh;
  max-width: 100vw;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
`

class Wrapper extends Component {

  render() {
    const { children } = this.props

    return (
      <WrapperStyle {...this.props}>
        { children }
      </WrapperStyle>
    )
  }
}

export default Wrapper
