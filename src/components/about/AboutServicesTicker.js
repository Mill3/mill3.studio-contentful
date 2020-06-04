import React, { createRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Box, Heading } from 'rebass'
import { TweenMax, Linear } from 'gsap'

import ResponsiveProp from '@utils/ResponsiveProp'
import { HORIZONTAL_SPACER } from '@components/content_rows'

const AboutServicesTicker = ({ text }) => {
  const ContainerMarginProp = new ResponsiveProp(HORIZONTAL_SPACER)
  const [gap, setGap] = useState(ContainerMarginProp.getValue())
  const [animating, setAnimating] = useState(null)
  const refMain = createRef()
  const refCopy = createRef()

  useEffect(() => {
    // set gap at each render
    setGap(ContainerMarginProp.getValue())

    // prevent re-render of Tween animation
    if (animating) return

    let elements = [refMain.current, refCopy.current]
    TweenMax.to(elements, 25, {
      x: '-100%',
      ease: Linear.easeNone,
      repeat: Infinity,
    })

    setAnimating(true)
  })

  return (
    <Box my={6} py={5} gap={gap} as={TickerContainer}>
      <Box as={TickerLine}>
        <TickerText fwRef={refMain} text={text} />
        <TickerText fwRef={refCopy} text={text} />
      </Box>
    </Box>
  )
}

const TickerText = ({ fwRef, text }) => {
  return (
    <Heading
      as={TickerLineItem}
      fontWeight={300}
      fontSize={['clamp(28px, calc(4vw + 28px), 120px)']}
      ref={fwRef}
    >
      {text} <Box as="span" fontFamily="headings" px={4}>→</Box>
    </Heading>
  )
}

export default AboutServicesTicker

const TickerContainer = styled.div`
  overflow-x: hidden;
  margin-left: ${props => props.theme.space[props.gap] * -1}px;
  margin-right: ${props => props.theme.space[props.gap] * -1}px;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  /* @media (max-width: ${props => props.theme.breakpoints[3]}) {
    margin-left: ${props => props.theme.space[HORIZONTAL_SPACER[3]] * -1}px;
    margin-right: ${props => props.theme.space[HORIZONTAL_SPACER[3]] * -1}px;
  }
  @media (max-width: ${props => props.theme.breakpoints[2]}) {
    margin-left: ${props => props.theme.space[HORIZONTAL_SPACER[2]] * -1}px;
    margin-right: ${props => props.theme.space[HORIZONTAL_SPACER[2]] * -1}px;
  }
  @media (max-width: ${props => props.theme.breakpoints[1]}) {
    margin-left: ${props => props.theme.space[HORIZONTAL_SPACER[1]] * -1}px;
    margin-right: ${props => props.theme.space[HORIZONTAL_SPACER[1]] * -1}px;
  }
  @media (max-width: ${props => props.theme.breakpoints[0]}) {
    margin-left: ${props => props.theme.space[HORIZONTAL_SPACER[0]] * -1}px;
    margin-right: ${props => props.theme.space[HORIZONTAL_SPACER[0]] * -1}px;
  } */
`

const TickerLine = styled.div`
  width: 80000px;
`

const TickerLineItem = styled.h4`
  text-transform: uppercase;
  display: inline-block;
`
