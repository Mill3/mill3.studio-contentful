import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'
import { InView } from 'react-intersection-observer'

import Container from '@styles/Container'
import { breakpoints, header } from '@styles/Theme'
import { TRANSITION_INTRO_DELAY, TRANSITION_DURATION } from '@utils/constants'
import { ArrowButton } from '@components/buttons'
import { AnimatedBackgroundContainer } from "@components/content_rows";
import { TRANSITION_PANE_STATES } from '@components/transitions'
import TransitionLinkComponent from '@components/transitions/TransitionLink'

const HeaderIntroPoses = posed.header({
  init: {
    y: 0,
  },
  entering: {
    y: 0,
  },
  leaving: {
    y: `-100%`,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION,
      },
    },
  },
})
const Header = styled(HeaderIntroPoses)`
  color: ${props => props.theme.colors.white};
  margin-top: -${header.height}px;
  padding-top: ${header.height}px;

  @media (min-width: ${breakpoints[2]}) {
    margin-top: -${header.height + 24}px;
    padding-top: ${header.height + 24}px;
  }
`
const HeaderTextStyle = styled.h1`
  margin: 0;
  line-height: 1.242857143;
  transform-origin: top center;
`
const ParagraphPoses = posed.div({
  init: {
    opacity: 0,
    y: 100,
  },
  appear: {
    opacity: 1,
    y: 0,
    delay: ({delay}) => delay,
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
}
const fontSizes = {
  'en': ['7.729468599vw', null, '4.861111111vw'],
  'fr': ['7.729468599vw', null, '4.861111111vw']
}


class HeaderIntro extends Component {
  static contextTypes = {
    layoutState: PropTypes.object,
  }

  render() {
    const { intl } = this.props
    const { layoutState } = this.context

    return (
      <Box
        as={Header}
        initialPose={`init`}
        pose={layoutState.transitionState === TRANSITION_PANE_STATES['visible'] ? `leaving` : `entering`}
      >
        <AnimatedBackgroundContainer backgroundColor={'black'}>
          <Container fluid display="flex" flexDirection="column" justifyContent="center" minHeight="53vh">
            <Text as={HeaderTextStyle} fontSize={fontSizes[intl.locale]} className={`is-serif fw-900`}>
              <SplitText
                initialPose={`exit`}
                pose={layoutState.transitionState === TRANSITION_PANE_STATES['visible'] ? `out` : `enter`}
                startDelay={
                  layoutState.transitionState === TRANSITION_PANE_STATES['intro']
                    ? TRANSITION_INTRO_DELAY * 1.25
                    : TRANSITION_DURATION * 0.85
                }
                charPoses={charPoses}
              >
                {intl.formatMessage({ id: 'intro.LineA' }).toString()}
              </SplitText>
            </Text>

            <Text as={HeaderTextStyle} fontSize={fontSizes[intl.locale]} className={`is-normal is-sans fw-300`}>
              <SplitText
                initialPose={`exit`}
                pose={layoutState.transitionState === TRANSITION_PANE_STATES['visible'] ? `out` : `enter`}
                startDelay={
                  layoutState.transitionState === TRANSITION_PANE_STATES['intro']
                    ? TRANSITION_INTRO_DELAY * 1.25
                    : TRANSITION_DURATION * 0.85
                }
                charPoses={charPoses}
              >
                {intl.formatMessage({ id: 'intro.LineB' }).toString()}
              </SplitText>
            </Text>
          </Container>

          <Container fluid display="flex" alignItems="center">
            <InView threshold={0.5} triggerOnce={true}>
              {({ inView, ref }) => (
                <Box
                  ref={ref}
                  as={ParagraphPoses}
                  width={['100%', null, '50%']}
                  initialPose={`init`}
                  pose={inView ? `appear` : null}
                  delay={0}
                >
                  <Text as="p" maxWidth={[414]} fontSize={['24px']} lineHeight={["1.333333333"]} m={0} p={0}>
                    {intl.formatMessage({ id: 'intro.AboutUs' }).toString()}
                  </Text>

                  <Text as="p" m={0} p={0} mt={3}>
                    <TransitionLinkComponent to={`/about/`}>
                      <ArrowButton color={"white"}>{intl.formatMessage({ id: 'intro.Button' })}</ArrowButton>
                    </TransitionLinkComponent>
                  </Text>
                </Box>
              )}
            </InView>

            <Box width={['100%', null, '50%']}>
              <Box width={['100%']} height={0} pb={['100%']} bg="#464925">
              </Box>
            </Box>
          </Container>
        </AnimatedBackgroundContainer>
      </Box>
    )
  }
}

export default injectIntl(HeaderIntro)
