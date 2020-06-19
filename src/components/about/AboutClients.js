import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import LottieAnimation from '@components/elements/LottieAnimation'
import { AboutSectionHeading } from './index'
import ClientsFooter from '@components/clients/ClientsFooter'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { ArrowButton } from '@components/buttons'
import Container from '@styles/Container'

import { lb2br } from '@utils/Linebreaks'

import shakeAnimation from "@animations/shake.json";

const AboutClients = ({ data, color = "#000" }) => {
  const { clientsIntro } = data

  return (
    <Box color={color}>
      <Container>

        <Flex as="header" alignItems="center" pt={[60, null, 100, 100, 150]} pb={[40, null, 90, 150]}>
          <AboutSectionHeading>
            <AnimatedHtmlTitle startDelay={750} source={clientsIntro.title} />
          </AboutSectionHeading>
          <Box as={LottieContainer} ml={`auto`} width={['16.90821256vw', null, '9.114583333vw', '7.056451613vw', `5vw`]}>
            <LottieAnimation animationData={shakeAnimation} />
          </Box>
        </Flex>

        {clientsIntro.introBlurb && (
          <Flex flexDirection={["column", null, null, "row"]} mt={[0, null, null, null, 40]}>
            <Text
              as="p"
              fontSize={['5.797101449vw', null, '3.645833333vw', '2.822580645vw', '1.944444444vw']}
              fontWeight="300"
              lineHeight={[1.5]}
              m={0}
              p={0}
              width={[1]}
              maxWidth={[null, null, null, '75vw', '55.555555556vw']}
              dangerouslySetInnerHTML={{ __html: lb2br(clientsIntro.introBlurb.introBlurb) }}
            />

            <Box
              as="nav"
              alignSelf={["flex-start", null, null, "flex-end"]}
              mt={[4, null, null, 0]}
              ml={[0, null, null, "auto"]}
            >
              <TransitionLinkComponent to="/contact/">
                <ArrowButton>Let's chat</ArrowButton>
              </TransitionLinkComponent>
            </Box>
          </Flex>
        )}

      </Container>

      <ClientsFooter asList={true} switchButton={false} limit={12} mt={[0, null, null, 125]} />

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
