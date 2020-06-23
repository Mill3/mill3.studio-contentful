import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import posed from 'react-pose'
import styled, { css } from 'styled-components';
import { Box, Flex } from 'rebass'
import { useInView } from 'react-intersection-observer'

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


const AboutEyes = ({ color = '#000' }) => {  
  const [ inViewRef, inView ] = useInView({ threshold: 0, triggerOnce: false })
  const { layoutState } = useContext(LayoutContext)
  const [ blink, setBlink ] = useState(true)
  const [ focus, setFocus ] = useState(0)
  const [ radians, setRadians ] = useState(Math.PI * -1)
  const { scrollbar } = layoutState
  const ref = useRef()

  // executed only when inView change
  useEffect(() => {
    let mouseEvent, 
        raf,
        constants = { cx: 0, cy: 0 }

    const onResize = () => {
      const { x, y, width, height } = ref.current.getBoundingClientRect()

      constants.cx = x + width * 0.5
      constants.cy = y + height * 0.5 + scrollbar.offset.y
    }
    const onRAF = () => {
      raf = requestAnimationFrame(onRAF)

      if( IS_TOUCH_DEVICE ) {
        if( scrollbar ) {
          const { y } = scrollbar._momentum
          const d = limit(0, SCROLL_MAX, Math.abs(y))

          // update states
          setRadians( y >= 0 ? Math.PI * -0.5 : Math.PI * 0.5 )
          setFocus( d / SCROLL_MAX )
        }
      } else {
        // get component center position
        let { cx, cy } = constants
  
        // subtract scrollbar y offset
        cy -= scrollbar ? scrollbar.offset.y : 0
  
        // if mouse position is null, set default value to component center
        const mx = mouseEvent ? mouseEvent.clientX : cx
        const my = mouseEvent ? mouseEvent.clientY : cy
  
        // calculate radians
        const radians = Math.atan2(my - cy, mx - cx)
  
        // distance between mouse and center of component
        const dist = limit( DISTANCE_MIN, DISTANCE_MAX, hypothenuse(mx, my, cx, cy) )
  
        // turn this into a percentage based value
        const percentage = (dist - DISTANCE_MIN) / (DISTANCE_MAX - DISTANCE_MIN)
  
        // update states
        setRadians(radians - Math.PI)
        setFocus(percentage)
        setBlink(percentage === 0)
      }
    }
    const onMouseMove = (event) => mouseEvent = event

    if( inView ) {
      // remove event listener before adding it to prevent doubling (safety check)
      Viewport.off(onResize)
      Viewport.on(onResize)
      onResize()

      // update blink state if necessary
      if( IS_TOUCH_DEVICE && blink === true ) setBlink(false)

      // remove event listener before adding it to prevent doubling (safety check)
      window.removeEventListener('mousemove', onMouseMove, { passive: false })
      window.addEventListener('mousemove', onMouseMove, { passive: false })

      if( !raf ) raf = requestAnimationFrame(onRAF)
    }
    else {
      Viewport.off(onResize)
      window.removeEventListener('mousemove', onMouseMove, { passive: false })

      if( raf ) {
        cancelAnimationFrame(raf)
        raf = null
      }
    }

    return () => {
      Viewport.off(onResize)
      window.removeEventListener('mousemove', onMouseMove, { passive: false })

      if( raf ) cancelAnimationFrame(raf)
    }
  }, [inView])

  // Use `useCallback` so we don't recreate the function on each render - Could result in infinite loop
  const setRefs = useCallback((node) => {
    // Ref's from useRef needs to have the node assigned to `current`
    ref.current = node
    // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
    inViewRef(node)
  }, [inViewRef])

  // render logics
  const x = -12 * Math.cos(radians) * focus
  const y = -24 * Math.sin(radians) * focus
  const bg = INVERTED_COLORS[color]
  const pose = blink || bg === "#000" ? 'blink' : 'open'

  return (
    <Flex
      ref={setRefs}
      as={ContainerStyle}
      justifyContent="space-between"
      width={['16.90821256vw', null, '9.114583333vw', '7.056451613vw', 70]}
      height={['12.801932367vw', null, '6.901041667vw', '5.342741935vw', 53]}
      color={color}
      aria-hidden="true"
      onClick={() => {
        setBlink(true)
        setTimeout(() => setBlink(false), 250)
      }}
    >
      <Eye x={x} y={y} bg={bg} pose={pose} />
      <Eye x={x} y={y} bg={bg} pose={pose} />
    </Flex>
  )
}

export default AboutEyes
