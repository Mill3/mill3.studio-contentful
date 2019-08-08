import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
//import { debounce } from 'lodash'


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
