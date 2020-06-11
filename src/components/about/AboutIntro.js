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
import { TRANSITION_INTRO_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'
import { lb2br } from '@utils/Linebreaks'

import globeAnimation from '@animations/globe.json'

const AboutIntro = ({ data, color = 'white' }, { layoutState }) => {

  const { transitionState } = layoutState
  const delay = transitionState === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY : TRANSITION_IN_DELAY

  return (
    <Flex
      as={AboutSectionContainer}
      color={color}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      pt={VERTICAL_SPACER}
      pb={[5]}
    >
      <AboutSectionHeading heading={'h1'} textAlign="center" px={[0, 0, 0, 3, `8vw`]}>
        <AnimatedHtmlTitle startDelay={delay} source={data.title} />
      </AboutSectionHeading>

      <Flex as={Footer} flexDirection="column" alignItems="center" paddingTop={[5]} >
        <Box py={[4]}>
          <TransitionContainer distance={50} autoCalculateDelay={false} delayIn={delay + 700} delayOut={0}>
            <LottieAnimation animationData={globeAnimation} />
          </TransitionContainer>
        </Box>
        {data.introBlurb &&
          <TransitionContainer distance={50} autoCalculateDelay={false} delayIn={delay + 750} delayOut={50}>
            <p py={[4]} dangerouslySetInnerHTML={{ __html: lb2br(data.introBlurb.introBlurb) }} />
          </TransitionContainer>
        }
        {data.shortText && (
          <TransitionContainer distance={50} autoCalculateDelay={false} delayIn={delay + 800} delayOut={250}>
            <Heading as="h5" fontWeight="300" mt={[3]}>
              {data.shortText}
            </Heading>
          </TransitionContainer>
        )}
      </Flex>
    </Flex>
  )
}

AboutIntro.contextTypes = {
  layoutState: PropTypes.object,
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
