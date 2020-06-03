import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { useInView } from 'react-intersection-observer'

import { charPoses } from '@components/header/HeaderIntro'

const AboutProcessIntro = ({ text }) => {
  const [ref, inView] = useInView({ threshold: 0.65, triggerOnce: true })

  return (
    <Box ref={ref} as={IntroContainer} py={[7]} px={[0]} textAlign="center">
      <Box as={EllipseSVG} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 625 290.4">
        <Box
          as={Ellipse}
          cx="312.5"
          cy="145.2"
          rx="308"
          ry="141"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          initialPose={`exit`}
          pose={inView ? `enter` : `exit`}
          duration={1250}
        ></Box>
      </Box>
      <Text as={TitleStyle} fontSize={`5vw`}>
        <SplitText
          initialPose={`out`}
          pose={inView ? `enter` : `out`}
          startDelay={inView ? 250 : 0}
          charPoses={charPoses}
        >
          {text}
        </SplitText>
      </Text>
    </Box>
  )
}

export default AboutProcessIntro

const IntroContainer = styled.div`
  position: relative;
`

export const TitlePoses = posed.h2({
  static: {
    opacity: 1,
  },
  sticky: {
    opacity: 0.075,
  },
})

const TitleStyle = styled(TitlePoses)`
  text-transform: uppercase;
  transform-origin: top center;
  line-height: 1.25;
`

const EllipseSVG = styled.svg`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: auto;
  transform: translate(-50%, -50%);
`
const Ellipse = posed.ellipse({
  exit: { strokeDasharray: 1460, strokeDashoffset: 1460 },
  enter: {
    strokeDashoffset: 2920,
    delay: ({ delay }) => delay,
    duration: ({ duration }) => duration,
    easing: 'circOut',
  },
})
