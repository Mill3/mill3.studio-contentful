import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'
import { useInView } from 'react-intersection-observer'

import TransitionContainer from '@components/transitions/TransitionContainer'
import { LayoutContext } from '@layouts/layoutContext'
import { lerp } from '@utils/Math'

const VELOCITY = 360 / (8 * 60) // 360deg / 8sec

const Container = styled.div`
  position: absolute;
  z-index: 100;
  pointer-events: none;

  svg, img {
    width: 100%;
    height: auto;
  }
`
const Figure = styled.div`
  transform-origin: center center;
  transform: rotate(0deg);
  will-change: transform;
`

const CircularIcon = ({ children, ...props }) => {
  const raf = useRef()
  const ref = useRef()
  const tween = useRef({ rotation: 0, velocity: VELOCITY })
  const [ inViewRef, inView ] = useInView()
  const { layoutState } = useContext(LayoutContext)
  const { scrollbar } = layoutState

  const animate = () => {
    const { current } = tween

    current.velocity = lerp(current.velocity, VELOCITY, 0.05)
    current.rotation += current.velocity

    if( ref.current ) ref.current.style.transform = `rotate(${current.rotation}deg)`

    // if inView, request animation frame
    if( inView ) raf.current = requestAnimationFrame(animate)
  }
  const scroll = () => {
    if( inView ) tween.current.velocity *= 1.04
  }

  // listen scrollbar
  useEffect(() => {
    scrollbar?.addListener(scroll)
    return () => scrollbar?.removeListener(scroll)
  }, [scrollbar])

  // start/stop infinite rotation
  useEffect(() => {
    // cancel previous animation frame
    if( raf.current ) cancelAnimationFrame(raf.current)
    raf.current = null

    // if inView, request animation frame
    if( inView ) raf.current = requestAnimationFrame(animate)

    return () => {
      if( raf.current ) cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }, [inView])
  
  return (
    <Box as={Container} ref={inViewRef} {...props}>
      <TransitionContainer distance={-25}>
        <Box width={['25vw', null, '15vw', '12vw']} pl={['5vw']}>
          <Box ref={ref} as="figure" m={0}>
            {children}
          </Box>
        </Box>
      </TransitionContainer>
    </Box>
  )
}

export default CircularIcon
