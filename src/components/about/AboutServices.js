import React, { useRef } from 'react'
import posed from 'react-pose'
import styled from 'styled-components'
import { Box, Flex, Heading } from 'rebass'
import { useInView } from 'react-intersection-observer'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import LottieAnimation from '@components/elements/LottieAnimation'
import { VERTICAL_SPACER } from '@components/content_rows'
import { format } from '@components/content_rows/ContentText'
import { HAS_HOVER } from '@utils/constants'
import { breakpoints } from '@styles/Theme'
import Viewport from '@utils/Viewport'
import { AboutSectionContainer, AboutSectionHeading } from './index'
import AboutServicesTicker from './AboutServicesTicker'
import { lb2br } from '@utils/Linebreaks'

import shakeAnimation from "@animations/globe.json"
import infiniAnimation from "@animations/infini.json"

const animationsBySlug = {
  strategy: shakeAnimation,
  design: infiniAnimation,
  technology: infiniAnimation,
  performance: infiniAnimation,
}

const Service = ({delay, title, text, slug}) => {
  const lottieRef = useRef()
  const [inViewRef, inView] = useInView({ threshold: 0, triggerOnce: true })
  const animation = slug ? animationsBySlug[slug] : null

  const wrapperProps = HAS_HOVER ? {
    onMouseEnter: () => lottieRef.current.play(),
    onMouseLeave: () => lottieRef.current.pause(),
  } : {}

  return (
    <Flex
      ref={inViewRef}
      flexDirection={'column'}
      {...wrapperProps}
    >
      <Box as={ServicePoses} initialPose="hidden" pose={inView ? "visible" : "hidden"} delay={delay} withParent={false}>
        <Box as={LottieContainer} flexShrink={0} width={40} height={80} aria-hidden="true">
          {animation && (
            <LottieAnimation startInView={false} ref={lottieRef} animationData={animation} />
          )}
        </Box>

        <Heading as="h4" m={0} mb={3} p={0} fontSize={[28]} fontWeight={400} lineHeight={1.214285714}>{title}</Heading>

        <Box as={ServiceDescription} mt={3} fontSize={2} lineHeight={1.5}>
          {text}
        </Box>
      </Box>
    </Flex>
  )
}

const AboutServices = ({ data, color }) => {
  const { servicesIntro, services } = data
  const IS_FLEX_ROW = Viewport.mq(`(min-width: ${breakpoints[1]})`)

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      py={VERTICAL_SPACER}
    >

      <Flex as="header">
        <AboutSectionHeading>
          <AnimatedHtmlTitle startDelay={750} source={servicesIntro.title} />
        </AboutSectionHeading>

        <Box as={LottieContainer} ml={`auto`} width={[`5vw`]}>
          <LottieAnimation animationData={shakeAnimation} />
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

      {services && (
        <Flex flexDirection={['column', null, 'row']} flexWrap={'wrap'} mt={[5, null, null, 6, 155]} mx={[0, null, -25]}>
          {services.map((service, i) => (
            <Box key={i} width={[1, null, 1/2, 1/4]} px={[0, null, 25]} mb={[5, null, null, 0]}>
              <Service
                title={service.title}
                text={format(service.description.description)}
                slug={service.slug}
                delay={IS_FLEX_ROW ? i * 125 : 0}
              />
            </Box>
          ))}
        </Flex>
      )}

    </Box>
  )
}

export default AboutServices


const ServicePoses = posed.div({
  hidden: {
    opacity: 0,
    y: 500,
    scale: 1.125,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    delay: ({ delay = 0 }) => delay,
    transition: {
      type: 'spring',
      stiffness: 30,
      mass: 0.925,
    },
  }
})

const LottieContainer = styled.div`
  svg {
    path {
      stroke: currentColor;
    }
  }
`
const ServiceDescription = styled.div`
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: ${props => props.theme.space[3]}px 3px;
      border-bottom: 1px solid ${props => props.theme.colors.gray};

      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      p {
        font-size: inherit;
        margin: 0;
        padding: 0;
      }
    }
  }
`
