import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { useInView } from 'react-intersection-observer'
// import SplitText from 'react-pose-text'
import Lottie from "lottie-react";

import globeAnimation from "@animations/globe.json";

import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
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
      px={HORIZONTAL_SPACER}
      py={VERTICAL_SPACER}
    >
      <AboutSectionHeading heading={'h1'} textAlign="center" px={[0, 0, 0, 3,`15vw`]}>
        <span dangerouslySetInnerHTML={{ __html: data.title }}></span>
      </AboutSectionHeading>
      <Flex as={Footer} flexDirection="column" alignItems="center" paddingTop={[5]} >
        <Lottie ref={animationRef} animationData={globeAnimation} />
        <h5>{ data.shortText }</h5>
      </Flex>
    </Flex>
  )
}

export default AboutIntro


// styles below here

const Footer = styled.footer`
  svg {
    transform: scale(0.95, 0.75) !important;
    margin-top: -160px;
    margin-bottom: -160px;
    path {
      stroke: #fff;
    }
  }
`