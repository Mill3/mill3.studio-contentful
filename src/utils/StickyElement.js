import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'

import { getTranslate } from '@utils/transform'

class StickyElement extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      y: 0
    }
    this.rect = {
      top: 0,
      bottom: 0
    }
    this.atEnd = false

    this.ref = createRef()

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    this.context.getScrollbar(s => {
      this.scrollbar = s
      this.scrollbar.addListener(this.onScroll)
    })

    window.addEventListener('resize', this.onResize)
    this.onResize()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)

    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null
  }
  getSnapshotBeforeUpdate(prevProps) {
    // if target has changed, recalculate boundaries
    if( prevProps.target !== this.props.target ) this.onResize()
    return true
  }

  onScroll({ offset }) {
    const { top, bottom }  = this.rect
    const y = Math.min(bottom, Math.min(top - offset.y, 0) * -1)

    if( this.state.y !== y ) this.setState({ y: y })
    if( y === bottom ) {
      if( !this.atEnd ) {
        this.atEnd = true

        const { onEnd } = this.props
        if( onEnd ) onEnd(true)
      }
    }
    else {
      if( this.atEnd ) {
        this.atEnd = false

        const { onEnd } = this.props
        if( onEnd ) onEnd(false)
      }
    }
  }
  onResize() {
    if( !this.props.target || !this.ref.current ) return

    const target = this.props.target.getBoundingClientRect()
    const el = this.ref.current.getBoundingClientRect()
    const translate = getTranslate( this.ref.current )
    const offset = el.top - target.top - translate.y

    this.rect.top = el.top + translate.y - offset
    this.rect.bottom = target.height - el.height - offset
  }

  render() {
    const { y } = this.state
    const { children, onEnd, ...props } = this.props

    return (
      <Box ref={this.ref} {...props} style={{transform: `translate3d(0px, ${y}px, 0)`}}>
        {children}
      </Box>
    )
  }
}

export default StickyElement
