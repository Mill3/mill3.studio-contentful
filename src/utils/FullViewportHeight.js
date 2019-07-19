import React, { Component, Fragment } from 'react'

import Viewport from '@utils/Viewport'

class FullViewportHeight extends Component {
  constructor(props) {
    super(props)

    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    Viewport.on(this.onResize)
    this.onResize()
  }

  componentWillUnmount() {
    Viewport.off(this.onResize)
  }

  onResize() {
    document.documentElement.style.setProperty('--vh', `${Viewport.height * 0.01}px`)
  }

  render() {
    return <Fragment>{this.props.children}</Fragment>
  }
}

export default FullViewportHeight
