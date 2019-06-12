import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'

import { breakpoints, header } from '@styles/Theme'
import Viewport from '@utils/Viewport'
import { TRANSITION_DURATION } from '@utils/constants'

import HeaderCircle from './HeaderCircle'

const HeaderIntroPoses = posed.header({
  init: {
    y: `102vh`,
  },
  enter: {
    y: 0,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION * 3 * 1000,
      },
    },
  },
})

const Header = styled(HeaderIntroPoses)`
  color: #fff;
  margin-top: -${header.height}px;
  position: relative;
  height: 53vh;

  h2 {
    margin: 0;
    line-height: 1.2;
  }

  @media (min-width: ${breakpoints[2]}) {
    height: 80vh;
  }
`
const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.black};
  transform-origin: top center;
  pointer-events: none;
`
const TextWrapper = styled(Flex)`
  position: relative;
  padding-top: ${header.height}px;
  padding-bottom: ${header.height / 2}px;
  z-index: 2;
  height: 100%;
  max-width: 100vw;
  overflow: hidden;
  transform-origin: top center;

  @media (min-width: ${breakpoints[2]}) {
    padding-bottom: 0;
  }
`
const TextWrapperCopy = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  padding-top: ${header.height}px;
  padding-bottom: calc(47vh + ${header.height / 2}px);
  height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  color: ${props => props.theme.colors.black};
  transform-origin: top center;
  z-index: 1;
  pointer-events: none;

  @media (min-width: ${breakpoints[2]}) {
    height: 150vh;
    padding-bottom: 70vh;
  }
`
const TextStyle = styled.h2`
  transform-origin: top center;
`

const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => TRANSITION_DURATION * 2 * 1000 + charIndex * 30,
    transition: {
      y: {
        type: 'spring',
      },
    },
  },
}

const fontSizes = ['7.729468599vw', null, '5.75vw']

const mobileBreakpoint = parseInt(breakpoints[2])

class HeaderIntro extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      x: 0.0,
      y: 0.0,
      skew: 0.0,
    }

    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount() {
    this.context.getScrollbar(scrollbar => {
      this.scrollbar = scrollbar
      this.scrollbar.addListener(this.onScroll)
    })
  }
  componentWillUnmount() {
    if( this.scrollbar ) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null
  }

  onScroll({ offset }) {
    const isMobile = Viewport.width < mobileBreakpoint
    const x = Math.min(0.8, offset.y / Viewport.height * (isMobile ? 0.53 : 0.8))
    const y = Math.min(Viewport.height, offset.y * 0.6)
    const skew = Math.min(1, offset.y / (Viewport.height * (isMobile ? 0.5 : 0.8)))

    // only update state if required
    // prevent useless render
    if( this.state.x === x && this.state.y === y && this.state.skew === skew ) return

    this.setState({
      x,
      y,
      skew,
    })
  }

  render() {
    const { transitionStatus, intl } = this.props
    const { x, y, skew } = this.state

    const isMobile = Viewport.width < mobileBreakpoint
    const angle = skew * (isMobile ? 15 : 10)
    const horizontal = isMobile ? 400 : 200
    const top = skew * Viewport.height * (isMobile ? -0.1 : -0.2)

    // tangent of angle = opposite / adjacent
    const radian = angle * Math.PI / 180
    const adjacent = Viewport.width
    const opposite = Math.tan(radian) * adjacent

    const t1 = { transform: `skewY(-${angle}deg) translate3d(${(x || 0) * -horizontal}px, ${y}px, 0)` }
    const t2 = { transform: `skewY(-${angle}deg) translate3d(${(x || 0) * horizontal}px, ${y}px, 0)` }
    const t3 = { transform: `skewY(${angle}deg) translate3d(0, ${top}px, 0)`}
    const t4 = { transform: `translate3d(0, -${opposite}px, 0)` }

    return (
      <Box as={Header} initialPose={`init`} pose={`enter`} className={`z-negative`}>
        <Box as={HeaderBackground} className={`z-negative`} style={t3}></Box>

        <Flex as={TextWrapper} flexDirection={`column`} justifyContent={`center`} width={`100%`} style={t3}>
          <Text
            as={TextStyle}
            fontSize={fontSizes}
            textAlign="center"
            className={`is-serif fw-200`}
            style={t1}
          >
            <SplitText
              initialPose={`exit`}
              pose={
                ['entering', 'entered', 'POP'].includes(transitionStatus)
                  ? `enter`
                  : `exit`
              }
              charPoses={charPoses}
            >
              {intl.formatMessage({ id: 'Craft, code and smile.' }).toString()}
            </SplitText>
          </Text>

          <Text
            as={TextStyle}
            fontSize={fontSizes}
            textAlign="center"
            className={`is-normal is-sans fw-300`}
            style={t2}
          >
            <SplitText
              initialPose={`exit`}
              pose={
                ['entering', 'entered', 'POP'].includes(transitionStatus)
                  ? `enter`
                  : `exit`
              }
              charPoses={charPoses}
            >
              {intl.formatMessage({ id: 'We are a digital agency.' }).toString()}
            </SplitText>
          </Text>
        </Flex>

        <Flex as={TextWrapperCopy} flexDirection={`column`} justifyContent={`center`} width={`100%`} style={t3} aria-hidden="true">
          <Text
            as={TextStyle}
            fontSize={fontSizes}
            textAlign="center"
            className={`is-serif fw-200`}
            style={t1}
          >
            <SplitText>
              {intl.formatMessage({ id: 'Craft, code and smile.' }).toString()}
            </SplitText>
          </Text>

          <Text
            as={TextStyle}
            fontSize={fontSizes}
            textAlign="center"
            className={`is-normal is-sans fw-300`}
            style={t2}
          >
            <SplitText>
              {intl.formatMessage({ id: 'We are a digital agency.' }).toString()}
            </SplitText>
          </Text>
        </Flex>

        <div style={t4}>
          <HeaderCircle />
        </div>
      </Box>
    )
  }
}

export default injectIntl(HeaderIntro)
