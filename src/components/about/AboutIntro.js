import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
// import SplitText from 'react-pose-text'
import Lottie from "lottie-react";

import globeAnimation from "@animations/globe.json";

import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'

const AboutIntro = ({ data, color }) => {
  const animationRef = useRef();

  return (
    <Flex
      as={AboutSectionContainer}
      color={color}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      py={VERTICAL_SPACER}
    >
      <AboutSectionHeading heading={'h1'} textAlign="center" px={[0, 0, 0, 3,`8vw`]}>
        <span dangerouslySetInnerHTML={{ __html: data.title }}></span>
      </AboutSectionHeading>
      <Flex as={Footer} flexDirection="column" alignItems="center" paddingTop={[5]} >
        <Box py={[4]}>
          <Lottie ref={animationRef} animationData={globeAnimation} />
        </Box>
        <Heading as="h5" fontWeight="300" mt={[3]}>{ data.shortText }</Heading>
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
