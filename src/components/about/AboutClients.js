import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import Lottie from "lottie-react";

import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'

import shakeAnimation from "@animations/shake.json";

const AboutClients = ({ data, color }) => {
  const { clientsIntro } = data
  // console.log('data:', data)
  const animationRef = useRef();

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      py={VERTICAL_SPACER}
    >
      <Flex as="header">
        <AboutSectionHeading>
          <span dangerouslySetInnerHTML={{ __html: clientsIntro.title }}></span>
        </AboutSectionHeading>
        <Box as={ShakeAnimationContainer} ml={`auto`} width={[`5vw`]}>
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

const ShakeAnimationContainer = styled.div`
  svg {
    path {
      fill: currentColor;
    }
  }
`