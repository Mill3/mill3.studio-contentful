import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import posed from 'react-pose'
import styled, { css } from 'styled-components';
import { Box, Flex } from 'rebass'
import { InView } from 'react-intersection-observer'

import { hypothenuse, limit } from '@utils/Math'
import Viewport from '@utils/Viewport'

const DEBUG = false
const DISTANCE_MIN = 50
const DISTANCE_MAX = 400
const INVERTED_COLORS = {
  '#fff': '#000',
  '#000': '#fff',
}

const DebugMixin = css`
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 100%;
    border: 1px solid black;
    transform: translate(-50%, -50%);
  }

  &::before {
    width: ${DISTANCE_MIN * 2}px;
    height: ${DISTANCE_MIN * 2}px;
    border-color: red;
  }
  &::after {
    width: ${DISTANCE_MAX * 2}px;
    height: ${DISTANCE_MAX * 2}px;
    border-color: green;
  }
`
const EyelidPoses = posed.div({
  blink: {
    y: 0,
    transition: {
      type: 'tween',
      duration: 125,
    },
  },
  open: {
    y: '-100%',
    transition: {
      type: 'tween',
      duration: 175,
    },
  },
})

const ContainerStyle = styled.div`
  ${() => DEBUG ? DebugMixin : null}
`
const EyeStyle = styled.div`
  position: relative;
  width: 33px;
  height: 100%;
  border-radius: 50%;
  border: 2px solid currentColor;
  overflow: hidden;
`
const PupilStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  margin: -9px 0 0 -9px;
  border-radius: 100%;
  background: currentColor;
  transform: translate3d(0px, 0px, 0);
  will-change: transform;
`
const EyelidStyle = styled(EyelidPoses)`
  position: absolute;
  top: -2px;
  left: -25%;
  width: 150%;
  height: 95%;
  border: 2px solid currentColor;
  border-top: 0;
  border-radius: 0 0 45% 45%;
`


class AboutEyes extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      radians: 0,
      focus: 0,
    }

    this.ref = createRef()
    this.scrollbar = null
    this.raf = null
    this.mouseEvent = null
    this.constants = {
      cx: 0,
      cy: 0,
    }

    this.onInViewChange = this.onInViewChange.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onRAF = this.onRAF.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    this.context.getScrollbar(s => {
      this.scrollbar = s
      this.onResize()
    })

    Viewport.on(this.onResize)
  }
  componentWillUnmount() {
    Viewport.off(this.onResize)
  }

  onInViewChange(inView) {
    if( inView ) {
      window.addEventListener('mousemove', this.onMouseMove, { passive: false })
      if( !this.raf ) this.raf = requestAnimationFrame(this.onRAF)
    }
    else {
      window.removeEventListener('mousemove', this.onMouseMove, { passive: false })
      if( this.raf ) cancelAnimationFrame(this.onRAF)

      this.raf = null;
      this.mouseEvent = null;
    }
  }
  onMouseMove(event) {
    this.mouseEvent = event;
  }
  onRAF() {
    this.raf = requestAnimationFrame(this.onRAF)

    // get component center position
    let { cx, cy } = this.constants

    // subtract scrollbar y offset
    cy -= this.scrollbar ? this.scrollbar.offset.y : 0

    // if mouse position is null, set default value to component center
    const mx = this.mouseEvent ? this.mouseEvent.clientX : cx
    const my = this.mouseEvent ? this.mouseEvent.clientY : cy

    // calculate radians
    const radians = Math.atan2(my - cy, mx - cx)

    // distance between mouse and center of component
    const dist = limit( DISTANCE_MIN, DISTANCE_MAX, hypothenuse(mx, my, cx, cy) )

    // turn this into a percentage based value
    const percentage = (dist - DISTANCE_MIN) / (DISTANCE_MAX - DISTANCE_MIN)

    // update state
    this.setState({
      radians: radians - Math.PI,
      focus: percentage,
    })
  }
  onResize() {
    if( !this.scrollbar ) return

    const rect = this.ref.current.getBoundingClientRect()

    this.constants.cx = rect.x + rect.width * 0.5
    this.constants.cy = rect.y + rect.width * 0.5
  }

  render() {
    const { color } = this.props
    const { focus, radians } = this.state

    const x = -12 * Math.cos(radians) * focus
    const y = -24 * Math.sin(radians) * focus

    return (
      <InView onChange={this.onInViewChange} threshold={0}>
        <Flex
          ref={this.ref}
          as={ContainerStyle}
          justifyContent="space-between"
          width={[70]}
          height={53}
          color={color}
          aria-hidden="true"
        >
          <Box as={EyeStyle}>
            <Box as={PupilStyle} style={{transform: `translate3d(${x}px, ${y}px, 0)`}} />
            <Box as={EyelidStyle} bg={INVERTED_COLORS[color]} initialPose={'blink'} pose={focus > 0 ? 'open' : 'blink'} withParent={false} />
          </Box>
          <Box as={EyeStyle}>
            <Box as={PupilStyle} style={{transform: `translate3d(${x}px, ${y}px, 0)`}} />
            <Box as={EyelidStyle} bg={INVERTED_COLORS[color]} initialPose={'blink'} pose={focus > 0 ? 'open' : 'blink'} withParent={false} />
          </Box>
        </Flex>
      </InView>
    )
  }
}

export default AboutEyes
