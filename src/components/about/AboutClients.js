import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import LottieAnimation from '@components/elements/LottieAnimation'
import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'
import ClientsFooter from '@components/clients/ClientsFooter'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { ArrowButton } from '@components/buttons'

import { lb2br } from '@utils/Linebreaks'

import shakeAnimation from "@animations/shake.json";

const AboutClients = ({ data, color = "#000" }) => {
  const { clientsIntro } = data

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      py={VERTICAL_SPACER}
    >
      <Flex as="header">
        <AboutSectionHeading>
          <AnimatedHtmlTitle startDelay={750} source={clientsIntro.title} />
        </AboutSectionHeading>
        <Box as={LottieContainer} ml={`auto`} width={[`5vw`]}>
          <LottieAnimation animationData={shakeAnimation} />
        </Box>
      </Flex>

      {clientsIntro.introBlurb && (
        <Flex py={VERTICAL_SPACER}>
          <Text
            as="p"
            fontSize={[null, null, null, 4]}
            fontWeight="300"
            width={[1, null, 1/2, 2/3]}
            maxWidth={[null, null, null, 920]}
            dangerouslySetInnerHTML={{ __html: lb2br(clientsIntro.introBlurb.introBlurb) }}
          />

          <Box as="nav" alignSelf="flex-end" ml="auto">
            <TransitionLinkComponent to="/contact/">
              <ArrowButton>Let's chat</ArrowButton>
            </TransitionLinkComponent>
          </Box>
        </Flex>
      )}

      <ClientsFooter asList={true} switchButton={false} limit={12} />

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
