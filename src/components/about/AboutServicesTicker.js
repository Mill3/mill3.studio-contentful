import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Box, Heading } from 'rebass'
import { useInView } from 'react-intersection-observer'

const AboutServicesTicker = ({ text }) => {
  const [ref, inView] = useInView({ threshold: 0 })
  return (
    <Box ref={ref} py={[40, null, 80]} as={TickerContainer}>
      <Box as={TickerLine}>
        <TickerText text={text} inView={inView} />
        <TickerText text={text} inView={inView} />
      </Box>
    </Box>
  )
}

const TickerText = ({ text, inView}) => {
  return (
    <Heading
      as={TickerLineItem}
      fontWeight={300}
      fontSize={['9.661835749vw', null, '10.416666667vw', '8.064516129vw', '5.555555556vw']}
      pr={4}
      inView={inView}
    >{text}</Heading>
  )
}

export default AboutServicesTicker

const TickerContainer = styled.div`
  overflow-x: hidden;
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
