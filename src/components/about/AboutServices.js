import React, { useRef } from 'react'
import posed from 'react-pose'
import styled from 'styled-components'
import { Box, Flex, Heading, Text } from 'rebass'
import { useInView } from 'react-intersection-observer'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import LottieAnimation from '@components/elements/LottieAnimation'
import { format } from '@components/content_rows/ContentText'
import { HAS_HOVER } from '@utils/constants'
import Container from '@styles/Container'
import { breakpoints } from '@styles/Theme'
import Viewport from '@utils/Viewport'
import { AboutSectionHeading } from './index'
import AboutServicesTicker from './AboutServicesTicker'
import { lb2br } from '@utils/Linebreaks'

import infiniAnimation from "@animations/infini.json"
import targetAnimation from "@animations/target.json"
import arrowAnimation from "@animations/arrow.json"
import triangleAnimation from "@animations/triangle.json"
import servicesAnimation from "@animations/services.json"

const animationsBySlug = {
  strategy: targetAnimation,
  design: triangleAnimation,
  technology: infiniAnimation,
  performance: arrowAnimation,
}

const Service = ({delay, title, text, slug}) => {
  const lottieRef = useRef()
  const [inViewRef, inView] = useInView({ threshold: 0, triggerOnce: true })
  const animation = slug ? animationsBySlug[slug] : null

  const wrapperProps = HAS_HOVER ? {
    onMouseEnter: () => lottieRef.current.play(),
    onMouseLeave: () => lottieRef.current.stop(),
  } : {}

  return (
    <Flex
      ref={inViewRef}
      flexDirection={'column'}
      {...wrapperProps}
    >
      <Box as={ServicePoses} initialPose="hidden" pose={inView ? "visible" : "hidden"} delay={delay} withParent={false}>
        <Box as={LottieContainer} flexShrink={0} width={40} height={['auto', null, 40]} aria-hidden="true">
          {animation && <LottieAnimation startInView={!HAS_HOVER} ref={lottieRef} animationData={animation} />}
        </Box>

        <Heading
          as="h4"
          m={0}
          mt={[50, null, 28]}
          p={0}
          fontSize={['5.797101449vw', null, '3.645833333vw', '2.822580645vw', '1.944444444vw']}
          fontWeight={300}
          lineHeight={[1.208333333, null, 1.214285714]}
        >{title}</Heading>

        <Box
          as={ServiceDescription}
          mt={[40, null, 4]}
          fontSize={['4.347826087vw', null, '2.34375vw', '1.814516129vw', '1.25vw']}
          lineHeight={1.5}
        >
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
    <Box color={color}>
      <Container fluid>
        <Flex as="header" alignItems="center" py={[60, null, 100, 140]}>
          <AboutSectionHeading>
            <AnimatedHtmlTitle startDelay={750} source={servicesIntro.title} />
          </AboutSectionHeading>

          <Box as={LottieContainer} ml={`auto`} width={['16.90821256vw', null, '9.114583333vw', '7.056451613vw', `5vw`]}>
            <LottieAnimation animationData={servicesAnimation} />
          </Box>
        </Flex>
      </Container>

      {servicesIntro.shortText &&
        <AboutServicesTicker text={servicesIntro.shortText} />
      }

      <Container fluid>
        {servicesIntro.introBlurb && (
          <Box width={[1]} maxWidth={[null, null, null, '76vw', '56vw']} mt={[60, null, 110]}>
            <Text
              as="p"
              fontSize={['5.797101449vw', null, '3.645833333vw', '2.822580645vw', '1.944444444vw']}
              fontWeight="300"
              lineHeight={1.5}
              m={0}
              p={0}
              dangerouslySetInnerHTML={{ __html: lb2br(servicesIntro.introBlurb.introBlurb) }}
            />
          </Box>
        )}

        {services && (
          <Flex flexDirection={['column', null, 'row']} flexWrap={'wrap'} mt={[70, null, null, 6, 155]} mx={[0, null, -25]}>
            {services.map((service, i) => (
              <Box key={i} width={[1, null, 1/2, 1/4]} px={[0, null, 25]} mb={[70, null, null, 0]}>
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
      </Container>

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
      padding: ${props => props.theme.space[3]}px 0;
      border-bottom: 1px solid ${props => props.theme.colors.gray};

      @media (min-width: ${props => props.theme.breakpoints[1]}) {
        padding-left: 3px;
        padding-right: 3px;
      }

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

      a {
        color: currentColor
      }

    }
  }
`
