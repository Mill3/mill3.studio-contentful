import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import Lottie from "lottie-react";

import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading, AnimatedTitle } from './index'
import AboutServicesTicker from './AboutServicesTicker'
import { lb2br } from '@utils/Linebreaks'

import shakeAnimation from "@animations/infinite.json";

const AboutServices = ({ data, color }) => {
  const { servicesIntro, services } = data
  const animationRef = useRef();

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      py={VERTICAL_SPACER}
    >

      <Flex as="header">
        <AboutSectionHeading>
          <AnimatedTitle startDelay={750} source={servicesIntro.title} />
        </AboutSectionHeading>
        <Box as={LottieContainer} ml={`auto`} width={[`5vw`]}>
          <Lottie ref={animationRef} animationData={shakeAnimation} />
        </Box>
      </Flex>

      {servicesIntro.shortText &&
        <AboutServicesTicker text={servicesIntro.shortText} />
      }

      {servicesIntro.introBlurb && (
        <Box width={[1,null,1/2,2/3]}>
          <Heading fontWeight="300" dangerouslySetInnerHTML={{ __html: lb2br(servicesIntro.introBlurb.introBlurb) }} />
        </Box>
      )}

      {services &&
      <Box mt={5}>
        {services.map((service, i) => (<Box key={i}>{service.title}</Box>))}
      </Box>
      }

    </Box>
  )
}

export default AboutServices


const LottieContainer = styled.div`
  svg {
    path {
      stroke: currentColor;
    }
  }
`
