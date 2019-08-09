import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'rebass'
import { debounce } from 'lodash'
import { TweenLite, TweenMax, Linear } from 'gsap'
import TransitionContainer from '@components/transitions/TransitionContainer'

const Container = styled.div`
  position: absolute;
  z-index: 100;
  pointer-events: none;

  svg, img {
    width: 100%;
    height: auto;
  }
`

class CircularIcon extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.animated = false
    this.timeScale = null
    this.tween = null
    this.ref = React.createRef()

    this.onScroll = this.onScroll.bind(this)
    this.onMouseWheelCompleted = this.onMouseWheelCompleted.bind(this)
    this.updateTimeScale = this.updateTimeScale.bind(this)

    this.onMouseWheelDebounce = debounce(this.onMouseWheelCompleted, 250)
  }

  componentDidMount() {
    this.timeScale = { value: 1 }
    this.rotation()
    this.mouse()
  }

  componentWillUnmount() {
    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null

    if (this.timeScaleTween) this.timeScaleTween.kill()
    this.timeScaleTween = null

    if (this.tween) this.tween.kill()
    this.tween = null
  }

  rotation() {
    if (!this.ref || !this.ref.current) return

    this.tween = TweenMax.to(this.ref.current, 8, {
      rotation: 360,
      ease: Linear.easeNone,
      repeat: -1,
    })
  }

  mouse() {
    this.context.getScrollbar(s => {
      this.scrollbar = s
      this.scrollbar.addListener(this.onScroll)
    })
  }

  onScroll() {
    if (this.animated === true) return
    this.animated = true

    this.updateTimeScale(3.25, 1.25)
    this.onMouseWheelDebounce()
  }

  onMouseWheelCompleted() {
    this.updateTimeScale(1, 0.25)
    this.animated = false
  }

  updateTimeScale(valueChange, duration) {
    if (this.timeScaleTween) this.timeScaleTween.kill()
    this.timeScaleTween = TweenLite.to(this.timeScale, duration, {
      value: valueChange,
      onUpdate: () => this.tween ? this.tween.timeScale(this.timeScale.value) : '',
    })
  }

  render() {
    const { children } = this.props

    return (
      <Box as={Container} {...this.props}>
        <TransitionContainer distance={-25}>
          <Box width={['25vw', null, '15vw', '12vw']} pl={['5vw']}>
            <Box as="figure" ref={this.ref} m={0}>
              {children}
            </Box>
          </Box>
        </TransitionContainer>
      </Box>
    )
  }
}

export default CircularIcon
