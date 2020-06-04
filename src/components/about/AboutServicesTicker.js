import React, { Component, createRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import { TweenMax, Linear } from 'gsap'

const AboutServicesTicker = ({ text }) => {
  const [animating, setAnimating] = useState(null);
  const refMain = createRef();
  const refCopy = createRef();

  // random duration
  let duration = 25

  useEffect(() => {
    if(animating) return;

    let elements = [refMain.current, refCopy.current]
    TweenMax.to(elements, duration, {
      x: '-100%',
      ease: Linear.easeNone,
      repeat: Infinity,
    })

    // prevent re-render
    setAnimating(true)
  })

  // combine two list of clients

  return (
    <Box my={6} py={5} as={TickerContainer}>
      <Box as={TickerLine}>
        <TickerText fwRef={refMain} text={text} />
        <TickerText fwRef={refCopy} text={text} />
      </Box>
    </Box>
  );
}

const TickerText = ({fwRef, text}) => {
  return (
    <Heading as={TickerLineItem} fontWeight={300} fontSize={['clamp(28px, calc(4vw + 28px), 120px)']} pr={4} ref={fwRef}>{text}</Heading>
  )
}


export default AboutServicesTicker;

const TickerContainer = styled.div`
  overflow-x: hidden;
  margin-left: ${props => props.theme.space[6] * -1}px;
  margin-right: ${props => props.theme.space[6] * -1}px;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
`

const TickerLine = styled.div`
  width: 80000px;
`

const TickerLineItem = styled.h4`
  text-transform: uppercase;
  display: inline-block;
`