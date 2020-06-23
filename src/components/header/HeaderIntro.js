import React, { Component, createRef, forwardRef, useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'gatsby-plugin-intl'
import { useInView } from 'react-intersection-observer'


import { ArrowButton } from '@components/buttons'
import { AnimatedBackgroundContainer } from '@components/content_rows'
import HeaderIntroVideo from '@components/header/HeaderIntroVideo'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { LayoutContext } from '@layouts/layoutContext'
import Container from '@styles/Container'
import { space } from '@styles/Theme'
import { TRANSITION_PANE_STATES, TRANSITION_IN_DELAY, TRANSITION_OUT_DURATION, INTRO_REVEALS_DELAY } from '@utils/constants'
import Viewport from '@utils/Viewport'


const HeaderIntroPoses = posed.header({
  init: {
    y: 0,
  },
  entering: {
    y: 0,
  },
  leaving: {
    y: `-75%`,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_OUT_DURATION * 2.75,
      },
    },
  },
})
const ParagraphPoses = posed.div({
  init: {
    opacity: 0,
    y: 100,
  },
  appear: {
    opacity: 1,
    y: 0,
    delay: ({ delay }) => delay,
    transition: {
      opacity: { duration: 400, easing: 'linear' },
      y: {
        type: 'spring',
        stiffness: 60,
        damping: 8,
      },
    },
  },
  leave: {
    opacity: 0,
    y: 100,
    delay: ({ delay }) => delay,
    transition: {
      opacity: { duration: 400, easing: 'linear' },
      y: {
        type: 'spring',
        stiffness: 60,
        damping: 8,
      },
    },
  },
})


const Header = styled(HeaderIntroPoses)`
  color: ${props => props.theme.colors.white};
  margin-top: ${space[6] * -1}px;
  padding-top: ${space[6]}px;
`
const HeaderTextStyle = styled.h1`
  margin: 0;
  line-height: 1.242857143;
  transform-origin: top center;
`

export const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex, startDelay }) => startDelay + charIndex * 30,
    transition: {
      y: {
        type: 'spring',
      },
    },
  },
  out: {
    opacity: 0,
    y: 20,
    delay: ({ charIndex }) => charIndex * 30,
    transition: {
      y: {
        type: 'spring',
      },
    },
  },
  leave: {
    opacity: 0,
    y: -20,
    delay: ({ charIndex }) => charIndex * 30,
    transition: {
      y: {
        type: 'spring',
      },
    },
  },
}
const fontSizes = {
  en: ['7.729468599vw', null, '6vw', '4.861111111vw'],
  fr: ['7.729468599vw', null, '6vw', '4.861111111vw'],
}


const HeaderIntro = ({ data, intl }) => {
  const boxVideoRef = useRef()

  const [ demoClicked, setDemoClicked ] = useState(false)
  const [ inViewRef, inView ] = useInView({ threshold: 0.5, triggerOnce: true })
  const { layoutState, dispatch } = useContext(LayoutContext)
  const { transition, demoReel } = layoutState

  const isDemoReel = demoReel?.active === true
  const isTransitionVisible = transition.inTransition
  const isTransitionIntro = transition.state === TRANSITION_PANE_STATES['intro']
  const titleDelay = isTransitionIntro ? INTRO_REVEALS_DELAY * 1.15 : TRANSITION_IN_DELAY * 1.15

  return (
    <Box as={Header} initialPose={`init`} pose={isTransitionVisible ? `leaving` : `entering`}>
      <AnimatedBackgroundContainer 
        backgroundColor={'transparent'} 
        duration={500} 
        onChange={(value) => {
          if (value === true) {
            dispatch({ type: 'header.invert' })
            dispatch({ type: 'body.invert' })
          } else {
            dispatch({ type: 'body.reset' })
            dispatch({ type: 'header.reset' })
          }
        }}
      >
        <Container fluid pt={['70px', null, '170px']} pb={['70px', null, '170px', 6]}>
          <Flex px={[16, 40 - space[4], 0]} display="flex" flexDirection="column">
            <Text as={HeaderTextStyle} fontSize={fontSizes[intl.locale]} className={`is-serif fw-900`}>
              <SplitText
                initialPose={`exit`}
                pose={isTransitionVisible ? `out` : `enter`}
                startDelay={titleDelay}
                charPoses={charPoses}
              >
                {intl.formatMessage({ id: 'intro.LineA' }).toString()}
              </SplitText>
            </Text>

            <Text as={HeaderTextStyle} fontSize={fontSizes[intl.locale]} className={`is-normal is-sans fw-300`}>
              <SplitText
                initialPose={`exit`}
                pose={isTransitionVisible ? `out` : `enter`}
                startDelay={titleDelay}
                charPoses={charPoses}
              >
                {intl.formatMessage({ id: 'intro.LineB' }).toString()}
              </SplitText>
            </Text>
          </Flex>
        </Container>

        <Container fluid display="flex" flexDirection={['column-reverse', null, 'row']} alignItems="center">
          <Box
            ref={inViewRef}
            as={ParagraphPoses}
            width={['100%', null, '55%', '50%']}
            mt={[45, null, 0]}
            pr={[0, null, '6vw', 0]}
            initialPose={`init`}
            pose={isDemoReel ? `leave` : inView ? `appear` : `init`}
            delay={isDemoReel ? 0 : inView && demoClicked ? 950 : 0}
          >
            <Text
              as="p"
              maxWidth={['100%', null, null, 425]}
              fontSize={[3, null, '24px']}
              lineHeight={['1.333333333']}
              m={0}
              p={0}
            >
              {intl.formatMessage({ id: 'intro.AboutUs' }).toString()}
            </Text>

            <Text as="p" m={0} p={0} mt={[60, null, 3]}>
              <TransitionLinkComponent to={`/about/`} color={'black'}>
                <ArrowButton color={'white'}>{intl.formatMessage({ id: 'intro.Button' })}</ArrowButton>
              </TransitionLinkComponent>
            </Text>
          </Box>

          <HeaderIntroVideo
            ref={boxVideoRef}
            video={data?.[Viewport.width < 768 ? 'demoReelMobile' : 'demoReel']?.video}
            width={['100%', null, '45%', '50%']}
            onClick={(e) => {
              if (e) {
                e.preventDefault()
                e.stopPropagation()
              }

              setDemoClicked(true)
              dispatch({ type: 'demoReel.start', trigger: boxVideoRef.current })
            }}
          />
        </Container>
      </AnimatedBackgroundContainer>
    </Box>
  )
}

export default injectIntl(HeaderIntro)
