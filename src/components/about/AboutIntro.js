import React, { useContext } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'

import { LayoutContext } from '@layouts/layoutContext'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import LottieAnimation from '@components/elements/LottieAnimation'
import { AboutSectionHeading } from './index'
import TransitionContainer from '@components/transitions/TransitionContainer'
import Container from '@styles/Container'
import { breakpoints, header } from '@styles/Theme'
import { TRANSITION_PANE_STATES, INTRO_REVEALS_DELAY,  TRANSITION_IN_DELAY } from '@utils/constants'
import { lb2br } from '@utils/Linebreaks'

import globeAnimation from '@animations/globe.json'

const AboutIntro = ({ data, color = 'white' }) => {
  const { layoutState } = useContext(LayoutContext)
  const { transition } = layoutState
  const delay = transition.state === TRANSITION_PANE_STATES[`intro`] ? INTRO_REVEALS_DELAY : TRANSITION_IN_DELAY

  return (
    <Box as={Header}>
      <Container fluid>
        <Box color={color} pt={["70px", null, "170px"]} pb={["70px", null, "170px", 6]}>
          <AboutSectionHeading heading={'h1'} textAlign="center" px={[0, 0, '5vw', `7.15vw`, '11vw']}>
            <AnimatedHtmlTitle startDelay={delay} source={data.title} />
          </AboutSectionHeading>
        </Box>

        <Flex as={Footer} color={color} flexDirection="column" alignItems="center" pb={[40, null, 50]}>
          <Box>
            <TransitionContainer distance={50} autoCalculateDelay={false} delayIn={delay + 700} delayOut={0}>
              <LottieAnimation animationData={globeAnimation} />
            </TransitionContainer>
          </Box>
          {data.introBlurb &&
            <TransitionContainer distance={50} autoCalculateDelay={false} delayIn={delay + 750} delayOut={50} mt={[40, null, 50]}>
              <p m={0} p={0} dangerouslySetInnerHTML={{ __html: lb2br(data.introBlurb.introBlurb) }} />
            </TransitionContainer>
          }
          {data.shortText && (
            <TransitionContainer distance={50} autoCalculateDelay={false} delayIn={delay + 800} delayOut={250} mt={[40, null, 50]}>
              <Heading as="h5" fontSize={['6.280193237vw', null, '3.645833333vw', '2.822580645vw']} fontWeight="300" m={0} p={0}>
                {data.shortText}
              </Heading>
            </TransitionContainer>
          )}
        </Flex>
      </Container>
    </Box>
  )
}

export default AboutIntro

// styles below here

const Header = styled.header`
  margin-top: ${header.height * -1}px;
  padding-top: ${header.height}px;

  @media (min-width: ${breakpoints[2]}) {
    margin-top: ${(header.height + 24) * -1}px;
    padding-top: ${header.height + 24}px;
  }
`
const Footer = styled.footer`
  svg {
    path {
      stroke: currentColor;
    }
  }
`
