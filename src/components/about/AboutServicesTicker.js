import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Box, Heading } from 'rebass'
import { useInView } from 'react-intersection-observer'

import { HORIZONTAL_SPACER_INVERTED } from '@components/content_rows'

const AboutServicesTicker = ({ text }) => {
  const [ref, inView] = useInView({ threshold: 0 })
  return (
    <Box ref={ref} mx={HORIZONTAL_SPACER_INVERTED} my={6} py={5} as={TickerContainer}>
      <Box as={TickerLine}>
        <TickerText text={text} inView={inView} />
        <TickerText text={text} inView={inView} />
      </Box>
    </Box>
  );
}

const TickerText = ({fwRef, text, inView}) => {
  return (
    <Heading
      as={TickerLineItem}
      fontWeight={300}
      fontSize={['clamp(28px, calc(4vw + 28px), 120px)']}
      pr={4}
      ref={fwRef}
      inView={inView}
    >{text}</Heading>
  )
}


export default AboutServicesTicker;

const TickerContainer = styled.div`
  overflow: hidden;
  max-width: 100vw;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
`
const TickerLine = styled.div`
  width: 80000px;
`

const tickerAnimation = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
`
const TickerLineItem = styled.h4`
  text-transform: uppercase;
  display: inline-block;
  animation-name: ${tickerAnimation};
  animation-duration: 25s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: ${({ inView }) => inView ? 'playing' : 'paused'};
`
