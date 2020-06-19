import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import posed from 'react-pose'
import styled, { css } from 'styled-components';
import { Box, Flex } from 'rebass'
import { InView } from 'react-intersection-observer'

import { LayoutContext } from '@layouts/layoutContext'

import { IS_TOUCH_DEVICE } from '@utils/constants'
import { hypothenuse, limit } from '@utils/Math'
import Viewport from '@utils/Viewport'

const DEBUG = false
const DISTANCE_MIN = 50
const DISTANCE_MAX = 400
const SCROLL_MAX = 100
const INVERTED_COLORS = {
  '#fff': 'black',
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
  pointer-events: ${IS_TOUCH_DEVICE ? 'auto' : 'none'};

  ${() => DEBUG ? DebugMixin : null}
`
const EyeStyle = styled.div`
  position: relative;
  height: 100%;
  border-radius: 50%;
  border: 2px solid currentColor;
  overflow: hidden;
`
const PupilStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
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


const Eye = ({ x, y, bg, pose }) => {
  const size = ['4.347826087vw', null, '2.34375vw', '1.814516129vw', 18]
  const margin = ['-2.173913043vw', null, '-1.171875vw', '-0.907258065vw', -9]

  return (
    <Box as={EyeStyle} width={['7.971014493vw', null, '4.296875vw', '3.326612903vw', 33]} mt={margin} ml={margin}>
      <Box as={PupilStyle} width={size} height={size} style={{transform: `translate3d(${x}px, ${y}px, 0)`}} />
      <Box as={EyelidStyle} bg={bg} initialPose={'blink'} pose={pose} withParent={false} />
    </Box>
  )
}

class AboutEyes extends Component {

  static contextType = LayoutContext

  constructor(props) {
    super(props)

    this.state = {
      radians: Math.PI * -1,
      focus: 0,
      blink: true,
    }

    this.ref = createRef()
    this.mounted = false
    this.scrollbar = null
    this.raf = null
    this.mouseEvent = null
    this.constants = {
      cx: 0,
      cy: 0,
    }

    this.onInViewChange = this.onInViewChange.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onRAF = this.onRAF.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    this.mounted = true
    Viewport.on(this.onResize)
  }

  componentDidUpdate() {
    if(this.scrollbar) return
    if(this.context.layoutState.scrollbar) {
      this.scrollbar = this.context.layoutState.scrollbar
      this.onResize()
    }
  }

  componentWillUnmount() {
    Viewport.off(this.onResize)
    window.removeEventListener('mousemove', this.onMouseMove, { passive: false })
    if( this.raf ) cancelAnimationFrame(this.onRAF)

    this.raf = null
    this.scrollbar = null
    this.mounted = false
  }

  onInViewChange(inView) {
    if( !this.mounted ) return

    if( inView ) {
      this.onResize()
      if( IS_TOUCH_DEVICE ) this.setState({ blink: false })

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
  onClick() {
    if( !this.mounted ) return

    this.setState({ blink: true }, () => {
      setTimeout(() => this.setState({ blink: false }), 250)
    })
  }
  onMouseMove(event) {
    this.mouseEvent = event;
  }
  onRAF() {
    if( !this.mounted ) return

    this.raf = requestAnimationFrame(this.onRAF)

    if( IS_TOUCH_DEVICE ) {
      if( this.scrollbar ) {
        const { y } = this.scrollbar._momentum
        const d = limit(0, SCROLL_MAX, Math.abs(y))

        this.setState({
          radians: y >= 0 ? Math.PI * -0.5 : Math.PI * 0.5,
          focus: d / SCROLL_MAX,
        })
      }
    } else {
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
        blink: percentage === 0,
      })
    }
  }
  onResize() {
    if( !this.mounted || !this.scrollbar || !this.ref.current ) return

    const rect = this.ref.current.getBoundingClientRect()

    this.constants.cx = rect.x + rect.width * 0.5
    this.constants.cy = rect.y + rect.height * 0.5 + this.scrollbar.offset.y
  }

  render() {
    const { color } = this.props
    const { blink, focus, radians } = this.state

    const x = -12 * Math.cos(radians) * focus
    const y = -24 * Math.sin(radians) * focus
    const bg = INVERTED_COLORS[color]
    const pose = blink || bg === "#000" ? 'blink' : 'open'

    return (
      <InView onChange={this.onInViewChange} threshold={0}>
        <Flex
          ref={this.ref}
          as={ContainerStyle}
          justifyContent="space-between"
          width={['16.90821256vw', null, '9.114583333vw', '7.056451613vw', 70]}
          height={['12.801932367vw', null, '6.901041667vw', '5.342741935vw', 53]}
          color={color}
          aria-hidden="true"
          onClick={this.onClick}
        >
          <Eye x={x} y={y} bg={bg} pose={pose} />
          <Eye x={x} y={y} bg={bg} pose={pose} />
        </Flex>
      </InView>
    )
  }
}

export default AboutEyes
