import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
//import { debounce } from 'lodash'


const WrapperStyle = styled.div`
  height: 100vh;
  max-width: 100vw;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  /* border: ${props => props.disabled ? '1px solid rebeccapurple' : 'none'}; */
`

class Wrapper extends Component {

  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      disabled: false,
    }

    /*
    this.onScroll = this.onScroll.bind(this)
    this.onScrollComplete = this.onScrollComplete.bind(this)
    this.debounced = debounce(this.onScrollComplete, 250)
    */
  }

  /*
  componentDidMount() {
    this.context.getScrollbar(s => {
      this.scrollbar = s
      this.scrollbar.addListener(this.onScroll)
    });
  }
  componentWillUnmount() {
    if( this.scrollbar ) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null
  }

  onScroll() {
    // update state only if required
    if( this.state.disabled !== true ) this.setState({ disabled: true })

    // debounce state update when scrolling is over for over 500ms
    this.debounced()
  }
  onScrollComplete() {
    this.setState({ disabled: false })
  }
  */

  render() {
    const { disabled } = this.state
    const { children } = this.props

    return (
      <WrapperStyle disabled={disabled} {...this.props}>
        { children }
      </WrapperStyle>
    )
  }
}

export default Wrapper
