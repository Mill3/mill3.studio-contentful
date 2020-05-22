import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'
import { InView } from 'react-intersection-observer'


import { charPoses } from '@components/header/HeaderIntro'
import { ParagraphPoses, StickyParagraphPoses, TitlePoses } from './'
import Container from '@styles/Container'



const TitleStyle = styled(TitlePoses)`
  margin: 0;
  text-transform: uppercase;
  transform-origin: top center;
`
const EllipseSVG = styled.svg`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: auto;
  transform: translate(-50%, -50%);
`
const Ellipse = posed.ellipse({
  exit: { strokeDasharray: 1460, strokeDashoffset: 1460 },
  enter: {
    strokeDashoffset: 2920,
    delay: ({delay}) => delay,
    transition: {
      duration: 850,
      easing: 'circOut',
    },
  },
})
const LatestSpan = styled.span`
  position: relative;
  padding-left: 50px;
  padding-right: 50px;

  & > div > div:nth-child(2) {
    margin-right: -0.125em;
  }
`
const ArrowSpan = posed.span({
  exit: { opacity: 0, x: '-50%' },
  enter: {
    opacity: 1,
    x: '0%',
    delay: ({delay}) => delay,
    transition: {
      x: {
        type: 'spring',
      },
    },
  },
  out: {
    opacity: 0,
    x: '50%',
    transition: {
      x: {
        type: 'spring',
      },
    },
  },
})
const WorkSpan = styled.span`
  & > div > div:nth-child(1) {
    margin-right: -0.075em;
  }
`
const LetsSpan = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
`

class StickyIntro extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this._top = 0
    this.state = {
      y: 0,
    }

    this.ref = React.createRef();
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount() {
    this.context.getScrollbar(s => {
      this.scrollbar = s
    })
  }
  componentWillUnmount() {
    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null
  }
  componentDidUpdate(prevProps) {
    if( prevProps.sticky === this.props.sticky ) return;

    if( this.ref.current && this.scrollbar ) {
      const rect = this.ref.current.getBoundingClientRect()
      this._top = rect.top - this.state.y + this.scrollbar.offset.y
    }
    if( this.scrollbar ) this.scrollbar[this.props.sticky ? 'addListener' : 'removeListener'](this.onScroll)
  }

  onScroll({ offset }) {
    this.setState({
      y: offset.y - this._top,
    })
  }

  render() {
    const { intl, fadeTitle, hideText, inverted, switchTitle } = this.props
    const { inView, y } = this.state

    const latest = intl.formatMessage({ id: 'intro.Latest' })
    const work = intl.formatMessage({ id: 'intro.Work' })
    const lets = intl.formatMessage({ id: 'intro.Lets' })

    return (
      <InView
        as={Box}
        onChange={(inView) => this.setState({ inView })}
        threshold={0.4}
        triggerOnce={true}
        pb={['25vh']}
      >
        <Container
          fluid
          ref={this.ref}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          color={inverted ? "white" : "black"}
          className="full-vh"
          style={{transform: `translate3d(0, ${y}px, 0)`}}
        >
          <Text
            as={TitleStyle}
            display="flex"
            fontFamily={'serif'}
            fontSize={["156px"]}
            fontWeight={"300"}
            alignItems="center"
            justifyContent="center"
            aria-label={`${switchTitle ? lets : latest} ${work}`}
            initialPose={`static`}
            pose={fadeTitle ? `sticky` : `static`}
          >
            <Box as={LatestSpan} className={'is-sans'} aria-hidden="true">
              <Box as={EllipseSVG} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 625 290.4">
                <Box
                  as={Ellipse}
                  cx="312.5"
                  cy="145.2"
                  rx="308"
                  ry="141"
                  stroke="currentColor"
                  strokeWidth="9"
                  fill="none"
                  initialPose={`exit`}
                  pose={inView ? `enter` : `exit`}
                ></Box>
              </Box>

              <SplitText
                initialPose={`exit`}
                pose={inView && !switchTitle ? `enter` : `out`}
                startDelay={inView && !switchTitle ? 550 : 0} 
                charPoses={charPoses}>
                {latest}
              </SplitText>

              <Box as={LetsSpan}>
                <SplitText
                  initialPose={`exit`}
                  pose={switchTitle ? `enter` : `out`}
                  startDelay={switchTitle ? latest.length * 30 : 0}
                  charPoses={charPoses}
                >
                  {lets}
                </SplitText>
              </Box>
            </Box>

            <Box as={ArrowSpan} initialPose={'exit'} pose={inView ? `enter` : null} delay={latest.length * 30 + 650} mx={[4]} aria-hidden="true">→</Box>

            <Box as={WorkSpan} aria-hidden="true">
              <SplitText
                initialPose={`exit`}
                pose={inView ? `enter` : `out`}
                startDelay={latest.length * 30 + 950}
                charPoses={charPoses}
              >
                {work}
              </SplitText>
            </Box>
          </Text>

          <Box
            as={ParagraphPoses}
            maxWidth={[467]}
            alignSelf="flex-end"
            initialPose={`init`}
            pose={inView ? `appear` : null}
            delay={1550}
          >
            <Text
              as={StickyParagraphPoses}
              fontSize={['24px']}
              lineHeight={["1.333333333"]}
              m={0}
              p={0}
              initialPose={`hidden`}
              pose={hideText ? `hidden` : `visible`}
            >
              {intl.formatMessage({ id: 'intro.LatestWorkIntro' }).toString()}
            </Text>
          </Box>
        </Container>
      </InView>
    )
  }
}

export default injectIntl(StickyIntro)
