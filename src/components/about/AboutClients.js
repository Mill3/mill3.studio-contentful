import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import Lottie from "lottie-react";

import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading, AnimatedTitle } from './index'
import ClientsFooter from '@components/clients/ClientsFooter'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { ArrowButton } from '@components/buttons'

import { lb2br } from '@utils/Linebreaks'

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
          <Lottie ref={animationRef} autoplay={false} animationData={shakeAnimation} />
        </Box>
      </Flex>

      {clientsIntro.introBlurb && (
        <Flex py={VERTICAL_SPACER}>
          <Heading fontWeight="300" width={[1,null,1/2,2/3]} dangerouslySetInnerHTML={{ __html: lb2br(clientsIntro.introBlurb.introBlurb) }} />
          <Box as="nav" alignSelf="flex-end" ml="auto">
            <TransitionLinkComponent to="/contact/">
              <ArrowButton>Let's chat</ArrowButton>
            </TransitionLinkComponent>
          </Box>
        </Flex>
      )}

      <ClientsFooter asList={true} switchButton={false} />

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
