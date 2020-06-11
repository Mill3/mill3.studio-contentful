import React, { Component, createRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'
import { InView } from 'react-intersection-observer'
import memoize from 'memoize-one'

import Container from '@styles/Container'
import { breakpoints, header, space } from '@styles/Theme'
import { HAS_HOVER, TRANSITION_INTRO_DELAY, TRANSITION_DURATION } from '@utils/constants'
import { lerp } from '@utils/Math'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'
import { ArrowButton } from '@components/buttons'
import { AnimatedBackgroundContainer } from '@components/content_rows'
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
  leave: {
    opacity: 0,
    y: 100,
    delay: ({delay}) => delay,
    transition: {
      opacity: { duration: 400, easing: 'linear' },
      y: {
        type: 'spring',
        stiffness: 60,
        damping: 8,
      },
    },
  }
})
const VideoPlayerPoses = posed.video({
  default: {
    right: 0,
    width: '100%',
    height: '100%',
    transition: {
      type: 'tween',
      duration: 950,
      delay: 350,
      ease: [0.645, 0.045, 0.355, 1.000],
    },
    flip: true,
  },
  fullscreen: {
    right: () => videoPlayerRightOffset.getValue(),
    width: () => videoPlayerWidth.getValue(),
    height: () => videoPlayerHeight.getValue(),
    transition: {
      type: 'tween',
      duration: 1250,
      ease: [0.645, 0.045, 0.355, 1.000],
    },
    flip: true,
  }
})
const VideoPlaybackPoses = posed.button({
  visible: {
    opacity: 1,
    delay: 850,
  },
  hidden: {
    opacity: 0,
    delay: 0,
  },
})

const Header = styled(HeaderIntroPoses)`
  color: ${props => props.theme.colors.white};
  margin-top: ${header.height * -1}px;
  padding-top: ${header.height}px;

  @media (min-width: ${breakpoints[2]}) {
    margin-top: ${(header.height + 24) * -1}px;
    padding-top: ${header.height + 24}px;
  }
`
const HeaderTextStyle = styled.h1`
  margin: 0;
  line-height: 1.242857143;
  transform-origin: top center;
`
const VideoPlayerStyle = styled(VideoPlayerPoses)`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`
const VideoPlaybackStyle = styled(VideoPlaybackPoses)`
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
  top: ${HAS_HOVER ? '-47px' : '50%'};
  right: ${HAS_HOVER ? '-47px' : '50%'};
  outline: none !important;
  cursor: pointer;
  transform-origin: center center;
  transform: ${HAS_HOVER ? 'translate3d(0px, 0px, 0)' : 'translate(50%, -50%) !important'};
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
  'en': ['7.729468599vw', null, '6vw', '4.861111111vw'],
  'fr': ['7.729468599vw', null, '6vw', '4.861111111vw']
}
const videoPlayerRightOffset = new ResponsiveProp([-24, space[4] * -1, '-5vw'])
const videoPlayerWidth = new ResponsiveProp(['100vw', null, null, '60vw'])
const videoPlayerHeight = new ResponsiveProp(['100vw', null, null, '100vh'])

const PLAY_BUTTON_DEFAULT = {
  x: -72,
  y: 0,
}
const PLAY_BUTTON_LERP = 0.08
const PLAY_BUTTON_SPRING = 0.05
const PLAY_BUTTON_FRICTION = 0.8

const VIDEO_LOOP_START_AT = 0
const VIDEO_LOOP_END_AT = 3


class BoxVideo extends Component {
  static contextTypes = {
    layoutState: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = { inView: false, ...PLAY_BUTTON_DEFAULT }
    this.target = { ...PLAY_BUTTON_DEFAULT }
    this.current = { ...PLAY_BUTTON_DEFAULT }
    this.velocity = { x: 0, y: 0 }
    this.isOver = false
    this.isStarted = false
    this.raf = null
    this.event = null
    this.rect = { width: 0, height: 0 }
    this.ref = createRef()
    this.video = createRef()

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onRender = this.onRender.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onTimeUpdate = this.onTimeUpdate.bind(this)
    this.onInViewChange = this.onInViewChange.bind(this)

    this.getPoses = memoize((active) => active ? ['fullscreen', 'hidden'] : ['default', 'visible'])
  }

  componentDidMount() {
    this.onResize()
    Viewport.on(this.onResize)
  }
  componentWillUnmount() {
    Viewport.off(this.onResize)

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
  onTimeUpdate() {
    // do nothing if videoRef is undefined
    if( !this.video.current ) return

    // if video is fullscreen, do not activate synthetic loop
    const { active } = this.context.layoutState.demoReel
    if( active ) return

    // get video timestamp
    const { currentTime } = this.video.current

    // if timestamp is higher than looping timestamp, set timestamp to loop beginning
    if( currentTime > VIDEO_LOOP_END_AT ) this.video.current.currentTime = VIDEO_LOOP_START_AT
  }
  onInViewChange(inView) {
    const { current } = this.video
    if( !current ) return

    if( inView ) current.play()
    else current.pause()
  }

  render() {
    const { forwardedRef, intl, video, ...rest} = this.props
    const { x, y } = this.state
    const { active } = this.context.layoutState.demoReel
    const [ playerPose, buttonPose ] = this.getPoses(active)

    return (
      <Box ref={forwardedRef} css={{position: 'relative'}} {...rest}>
        <InView onChange={this.onInViewChange}>
          <Box width={['100%']} height={0} pb={['100%']} css={{position: 'relative'}}>
            <Box
              as={VideoPlayerStyle}
              ref={this.video}
              onTimeUpdate={this.onTimeUpdate}
              disablePictureInPicture
              muted={!active}
              playsInline
              preload="auto"
              loop
              src={video?.file?.url}
              initialPose="default"
              pose={playerPose}
            />
          </Box>
        </InView>

        <Box
          as={VideoPlaybackStyle}
          initialPose="visible"
          pose={buttonPose}
          style={{transform: `translate3d(${x}px, ${y}px, 0)`}}
        >{intl.formatMessage({ id: 'demoReel.Play' })}</Box>

        {HAS_HOVER && <Box
          ref={this.ref}
          width={['100%']}
          height={'100%'}
          css={{position: 'absolute', top: 0, left: 0, cursor: 'pointer'}}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
         />}
      </Box>
    )
  }
}


const I18nBoxVideo = injectIntl(BoxVideo)
const ForwardedBoxVideo = forwardRef((props, ref) =>
  <I18nBoxVideo {...props} forwardedRef={ref} />
)


class HeaderIntro extends Component {
  static contextTypes = {
    layoutState: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.boxVideoRef = createRef()
    this.demoAsBeenClickedOnce = false

    this.onBoxVideoClicked = this.onBoxVideoClicked.bind(this)
  }

  onBoxVideoClicked(e) {
    if( e ) {
      e.preventDefault()
      e.stopPropagation()
    }

    this.context.layoutState.setDemoReel(true, this.boxVideoRef.current)
  }

  render() {
    const { intl, data } = this.props
    const { layoutState } = this.context
    const { transitionState, demoReel } = layoutState

    const isDemoReel = demoReel.active === true
    const isTransitionVisible = transitionState === TRANSITION_PANE_STATES['visible']
    const isTransitionIntro = transitionState === TRANSITION_PANE_STATES['intro']
    const titleDelay = isTransitionIntro ? TRANSITION_INTRO_DELAY * 1.25 : TRANSITION_DURATION * 0.85

    if( !this.demoAsBeenClickedOnce ) this.demoAsBeenClickedOnce = isDemoReel;

    return (
      <Box
        as={Header}
        initialPose={`init`}
        pose={isTransitionVisible ? `leaving` : `entering`}
      >
        <AnimatedBackgroundContainer backgroundColor={'black'} duration={500}>
          <Container fluid display="flex" flexDirection="column" pt={["70px", null, "170px"]} pb={["70px", null, "170px", 6]}>
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
          </Container>

          <Container fluid display="flex" flexDirection={["column-reverse", null, "row"]} alignItems="center">
            <InView threshold={0.5} triggerOnce={true}>
              {({ inView, ref }) => (
                <Box
                  ref={ref}
                  as={ParagraphPoses}
                  width={['100%', null, '55%', '50%']}
                  mt={[4, null, 0]}
                  pr={[0, null, '6vw', 0]}
                  initialPose={`init`}
                  pose={isDemoReel ? `leave` : (inView ? `appear` : `init`)}
                  delay={isDemoReel ? 0 : (inView && this.demoAsBeenClickedOnce ? 950 : 0 )}
                >
                  <Text as="p" maxWidth={['100%', null, null, 414]} fontSize={[3, null, '24px']} lineHeight={["1.333333333"]} m={0} p={0}>
                    {intl.formatMessage({ id: 'intro.AboutUs' }).toString()}
                  </Text>

                  <Text as="p" m={0} p={0} mt={3}>
                    <TransitionLinkComponent to={`/about/`} color={'black'}>
                      <ArrowButton color={"white"}>{intl.formatMessage({ id: 'intro.Button' })}</ArrowButton>
                    </TransitionLinkComponent>
                  </Text>
                </Box>
              )}
            </InView>

            <ForwardedBoxVideo
              ref={this.boxVideoRef}
              video={data?.demoReel?.video}
              width={['100%', null, '45%', '50%']}
              onClick={this.onBoxVideoClicked}
            />
          </Container>
        </AnimatedBackgroundContainer>
      </Box>
    )
  }
}

export default injectIntl(HeaderIntro)
