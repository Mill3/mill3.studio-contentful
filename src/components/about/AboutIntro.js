import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import LottieAnimation from '@components/elements/LottieAnimation'
import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'
import { TRANSITION_PANE_STATES } from '@components/transitions'
import TransitionContainer from '@components/transitions/TransitionContainer'
import Container from '@styles/Container'
import { TRANSITION_INTRO_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'
import { lb2br } from '@utils/Linebreaks'

import globeAnimation from '@animations/globe.json'

const AboutIntro = ({ data, color = 'white' }, { layoutState }) => {

  const { transitionState } = layoutState
  const delay = transitionState === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY : TRANSITION_IN_DELAY

  return (
    <Container fluid>
      <Flex
        as={AboutSectionContainer}
        color={color}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        pt={VERTICAL_SPACER}
        pb={[5]}
      >
        <AboutSectionHeading heading={'h1'} textAlign="center" px={[0, 0, '5vw', `8vw`, '12vw']}>
          <AnimatedHtmlTitle startDelay={delay} source={data.title} />
        </AboutSectionHeading>
      </Flex>

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
  )
}

AboutIntro.contextTypes = {
  layoutState: PropTypes.object,
}

export default AboutIntro

// styles below here

const Footer = styled.footer`
  svg {
    path {
      stroke: currentColor;
    }
  }
`
