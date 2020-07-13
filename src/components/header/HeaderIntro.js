import React, { useCallback, useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Box, Flex, Text } from 'rebass'
import SplitText from 'react-pose-text'
import { injectIntl } from 'gatsby-plugin-intl'
import { useInView } from 'react-intersection-observer'


import HeaderIntroDescription from '@components/header/HeaderIntroDescription'
import HeaderIntroVideo from '@components/header/HeaderIntroVideo'
import { LayoutContext } from '@layouts/layoutContext'
import Container from '@styles/Container'
import { space } from '@styles/Theme'
import { TRANSITION_PANE_STATES, TRANSITION_IN_DELAY, INTRO_REVEALS_DELAY } from '@utils/constants'
import Viewport from '@utils/Viewport'



const Header = styled.header`
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

  const [ inViewRef, inView ] = useInView()
  const { layoutState, dispatch } = useContext(LayoutContext)
  const { transition } = layoutState

  const demoClicked = useCallback(e => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    dispatch({ type: 'demoReel.start', trigger: boxVideoRef.current })
  })

  useEffect(() => {
    dispatch({ type: inView ? 'inverted.set' : 'inverted.reset' })
  }, [inView])

  const isTransitionVisible = transition.inTransition
  const isTransitionIntro = transition.state === TRANSITION_PANE_STATES['intro']
  const titleDelay = isTransitionIntro ? INTRO_REVEALS_DELAY * 1.15 : TRANSITION_IN_DELAY * 1.15

  console.log(Viewport.width < 768 ? 'demoReelMobile' : 'demoReel');

  return (
    <Box ref={inViewRef} as={Header} color="white">
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
        <HeaderIntroDescription />

        <HeaderIntroVideo
          ref={boxVideoRef}
          video={data?.[Viewport.width < 768 ? 'demoReelMobile' : 'demoReel']?.video}
          width={['100%', null, '45%', '50%']}
          onClick={demoClicked}
        />
      </Container>
    </Box>
  )
}

export default injectIntl(HeaderIntro)
