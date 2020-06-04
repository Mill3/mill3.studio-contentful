import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import Lottie from 'lottie-react'

import globeAnimation from '@animations/globe.json'

import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading, AnimatedTitle } from './index'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { lb2br } from '@utils/Linebreaks'

const AboutIntro = ({ data, color }) => {
  const animationRef = useRef()

  return (
    <Flex
      as={AboutSectionContainer}
      color={color}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      py={VERTICAL_SPACER}
    >
      <AboutSectionHeading heading={'h1'} textAlign="center" px={[0, 0, 0, 3, `8vw`]}>
        <AnimatedTitle startDelay={1000} source={data.title} />
      </AboutSectionHeading>

      <Flex as={Footer} flexDirection="column" alignItems="center" paddingTop={[5]}>
        <Box py={[4]}>
          <TransitionContainer distance={50} autoCalculateDelay={false} delayIn={1700} delayOut={0}>
            <Lottie ref={animationRef} animationData={globeAnimation} />
          </TransitionContainer>
        </Box>
        {data.introBlurb && <p py={[4]} dangerouslySetInnerHTML={{ __html: lb2br(data.introBlurb.introBlurb) }} />}
        {data.shortText && (
          <TransitionContainer distance={50} autoCalculateDelay={false} delayIn={1775} delayOut={0}>
            <Heading as="h5" fontWeight="300" mt={[3]}>
              {data.shortText}
            </Heading>
          </TransitionContainer>
        )}
      </Flex>
    </Flex>
  )
}

export default AboutIntro

// styles below here

const Footer = styled.footer`
  svg {
    /* transform: scale(0.95, 0.75) !important;
    margin-top: -160px;
    margin-bottom: -160px; */
    path {
      stroke: currentColor;
    }
  }
`
