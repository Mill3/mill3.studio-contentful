import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import Lottie from "lottie-react";

import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading, AnimatedTitle } from './index'

import shakeAnimation from "@animations/shake.json";

const AboutClients = ({ data, color }) => {
  const { clientsIntro } = data
  const animationRef = useRef();

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      py={VERTICAL_SPACER}
    >
      <Flex as="header">
        <AboutSectionHeading>
          <AnimatedTitle startDelay={750} source={clientsIntro.title} />
        </AboutSectionHeading>
        <Box as={LottieContainer} ml={`auto`} width={[`5vw`]}>
          <Lottie ref={animationRef} animationData={shakeAnimation} />
        </Box>
      </Flex>

      {clientsIntro.introBlurb && (
        <Box py={VERTICAL_SPACER}>
          <Heading dangerouslySetInnerHTML={{ __html: clientsIntro.introBlurb.introBlurb }} />
        </Box>
      )}

    </Box>
  )
}

export default AboutClients

const LottieContainer = styled.div`
  svg {
    path {
      fill: currentColor;
    }
  }
`
