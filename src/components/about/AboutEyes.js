import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components';
import { Box, Flex } from 'rebass'
import { InView } from 'react-intersection-observer'

import { hypothenuse, limit } from '@utils/Math'
import Viewport from '@utils/Viewport'

const DEBUG = false
const DISTANCE_MIN = 50
const DISTANCE_MAX = 400

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
const ContainerStyle = styled.div`
  ${() => DEBUG ? DebugMixin : null}

  & > div {
    position: relative;
    width: 33px;
    height: 100%;
    border-radius: 50%;
    border: 2px solid currentColor;
    overflow: hidden;

    & > div {
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
    }
  }
`


class AboutEyes extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      degrees: 0,
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
          color="currentColor"
          aria-hidden="true"
        >
          <Box>
            <Box style={{transform: `translate3d(${x}px, ${y}px, 0)`}}></Box>
          </Box>
          <Box>
            <Box style={{transform: `translate3d(${x}px, ${y}px, 0)`}}></Box>
          </Box>
        </Flex>
      </InView>
    )
  }
}

export default AboutEyes
