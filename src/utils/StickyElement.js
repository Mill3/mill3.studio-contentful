import React, { Component, createRef } from 'react'
import { Box } from 'rebass'

import { getTranslate } from '@utils/transform'

import { LayoutContext } from '@layouts/layoutContext'

class StickyElement extends Component {
  static contextType = LayoutContext

  constructor(props) {
    super(props)

    this.state = {
      y: 0
    }
    this.rect = {
      top: 0,
      bottom: 0
    }
    this.scrollY = 0
    this.scrollLimit = 0
    this.atEnd = false
    this.scrollbar = null

    this.ref = createRef()

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  componentDidUpdate() {
    if(this.scrollbar) return
    if(this.context.layoutState.scrollbar) {
      this.scrollbar = this.context.layoutState.scrollbar
      this.scrollbar.addListener(this.onScroll)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)

    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // if target has changed, recalculate boundaries
    if( prevProps.target !== this.props.target ) this.onResize()
    // if scroll limit has changed, recalculate boundaries
    else if( this.scrollbar && this.scrollLimit !== this.scrollbar.limit.y ) {
      this.scrollLimit = this.scrollbar.limit.y
      this.onResize()
    }

    return true
  }

  calculateHeight() {
    if(!this.ref.current) return 0;

    const elements = this.ref.current.querySelectorAll(`:scope > *`);
    let h = 0

    if(!elements) return h;

    // console.log('elements:', elements)
    [...elements].forEach(e => { if(e.getBoundingClientRect().height > h) h += e.getBoundingClientRect().height })

    return h;
  }

  onScroll({ offset }) {
    this.scrollY = offset.y

    const { top, bottom }  = this.rect
    const heightOffset = this.props.contained ? this.calculateHeight() : 0;
    const y = Math.min(bottom - heightOffset, Math.min(top - this.scrollY, 0) * -1)

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

    this.rect.top = this.scrollY + el.top - translate.y - offset
    this.rect.bottom = target.height - el.height - offset
  }

  render() {
    const { y } = this.state
    const { children, onEnd, ...props } = this.props
    // console.log(this.context);

    return (
      <Box ref={this.ref} {...props} style={{transform: `translate3d(0px, ${y}px, 0)`}}>
        {children}
      </Box>
    )
  }
}

// StickyElement.contextType = LayoutContext

export default StickyElement
