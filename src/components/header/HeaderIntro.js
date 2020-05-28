import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'
import { InView } from 'react-intersection-observer'

import Container from '@styles/Container'
import { breakpoints, colors, header } from '@styles/Theme'
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
const VideoPlaybackStyle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  background: none;
  border: 2px solid currentColor;
  border-radius: 100%;
  color: currentColor;
  text-transform: uppercase;
  position: absolute;
  top: -47px;
  right: -47px;
  outline: none !important;
  cursor: pointer;
  transform-origin: center center;
  transform: translate3d(0px, 0px, 0);
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
}
const fontSizes = {
  'en': ['7.729468599vw', null, '6vw', '4.861111111vw'],
  'fr': ['7.729468599vw', null, '6vw', '4.861111111vw']
}

const PLAY_BUTTON_DEFAULT = {
  x: -72,
  y: 0,
}
const PLAY_BUTTON_LERP = 0.08
const PLAY_BUTTON_SPRING = 0.05
const PLAY_BUTTON_FRICTION = 0.8

/**
 * lerp(start, end, multiplier);
 * lerp(0, 100, 0.12);
 */
export const lerp = (s, e, m) => s * (1 - m) + e * m;


class BoxVideo extends Component {
  constructor(props) {
    super(props)

    this.state = { ...PLAY_BUTTON_DEFAULT }
    this.target = { ...PLAY_BUTTON_DEFAULT }
    this.current = { ...PLAY_BUTTON_DEFAULT }
    this.velocity = { x: 0, y: 0 }
    this.isOver = false
    this.isStarted = false
    this.raf = null
    this.event = null
    this.rect = { width: 0, height: 0 }
    this.ref = createRef()

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onRender = this.onRender.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
    if( this.raf ) cancelAnimationFrame(this.raf)
    this.raf = null;
  }

  onMouseEnter(e) {
    this.isOver = true

    if( this.isStarted === false ) {
      this.isStarted = true
      this.event = e.nativeEvent
      this.raf = requestAnimationFrame(this.onRender)
    }
  }
  onMouseLeave() { this.isOver = false }
  onMouseMove(e) { this.event = e.nativeEvent }
  onRender() {
    if( this.isOver ) {
      this.target.x = this.event.offsetX - this.rect.width
      this.target.y = this.event.offsetY

      this.current.x = lerp(this.current.x, this.target.x, PLAY_BUTTON_LERP)
      this.current.y = lerp(this.current.y, this.target.y, PLAY_BUTTON_LERP)
    }
    else {
      this.target.x = this.rect.width * -0.5
      this.target.y = this.rect.height * 0.5

      const ax = ( this.target.x - this.current.x ) * PLAY_BUTTON_SPRING
      const ay = ( this.target.y - this.current.y ) * PLAY_BUTTON_SPRING

      this.velocity.x += ax
      this.velocity.y += ay

      this.velocity.x *= PLAY_BUTTON_FRICTION
      this.velocity.y *= PLAY_BUTTON_FRICTION

      this.current.x += this.velocity.x
      this.current.y += this.velocity.y
    }

    this.setState({
      x: this.current.x,
      y: this.current.y
    }, () => {
      this.raf = requestAnimationFrame(this.onRender)
    })
  }
  onResize() {
    if( this.ref.current ) this.rect = this.ref.current.getBoundingClientRect()
  }

  render() {
    const { x, y } = this.state

    return (
      <Box css={{position: 'relative'}} {...this.props}>
        <Box width={['100%']} height={0} pb={['100%']} bg="#464925">
        </Box>

        <Box as={VideoPlaybackStyle} style={{transform: `translate3d(${x}px, ${y}px, 0)`}}>Play</Box>

        <Box
          ref={this.ref}
          width={['100%']}
          height={'100%'}
          css={{position: 'absolute', top: 0, left: 0, cursor: 'pointer'}}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
         />
      </Box>
    )
  }
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
        <AnimatedBackgroundContainer backgroundColor={'black'} duration={500}>
          <Container fluid display="flex" flexDirection="column" pt={[6, null, "170px"]} pb={[6, null, "170px", 6]}>
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

          <Container fluid display="flex" flexDirection={["column-reverse", null, "row"]} alignItems="center">
            <InView threshold={0.5} triggerOnce={true}>
              {({ inView, ref }) => (
                <Box
                  ref={ref}
                  as={ParagraphPoses}
                  width={['100%', null, '55%', '50%']}
                  pr={[0, null, '6vw', 0]}
                  initialPose={`init`}
                  pose={inView ? `appear` : null}
                  delay={0}
                >
                  <Text as="p" maxWidth={['100%', null, null, 414]} fontSize={[3, null, '24px']} lineHeight={["1.333333333"]} m={0} p={0}>
                    {intl.formatMessage({ id: 'intro.AboutUs' }).toString()}
                  </Text>

                  <Text as="p" m={0} p={0} mt={3}>
                    <TransitionLinkComponent to={`/about/`} color={colors.black}>
                      <ArrowButton color={"white"}>{intl.formatMessage({ id: 'intro.Button' })}</ArrowButton>
                    </TransitionLinkComponent>
                  </Text>
                </Box>
              )}
            </InView>

            <BoxVideo
              width={['100%', null, '45%', '50%']}
              mb={[4, null, 0]}
              onClick={() => console.log('play video')}
            />
          </Container>
        </AnimatedBackgroundContainer>
      </Box>
    )
  }
}

export default injectIntl(HeaderIntro)
