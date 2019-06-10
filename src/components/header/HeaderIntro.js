import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'

import { header } from '@styles/Theme'
import Viewport from '@utils/Viewport'

import {
  TRANSITION_DURATION,
  TRANSITION_EXIT_DURATION,
} from '@utils/constants'

import HeaderCircle from './HeaderCircle'

const HeaderIntroPoses = posed.header({
  init: {
    y: `102vh`,
    marginBottom: 500,
    height: `100vh`,
  },
  entered: {
    y: 0,
    marginBottom: 0,
    height: `70vh`,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION * 3 * 1000,
      },
      marginBottom: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION * 3 * 1000,
      },
      height: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION * 3 * 1000,
      },
    },
  },
  exiting: {
    y: `-10vh`,
    height: `0vh`,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
      marginBottom: {
        type: 'tween',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
      height: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
    },
  },
})

const Header = styled(HeaderIntroPoses)`
  color: #fff;
  padding-top: ${header.height}px;
  margin-top: -${header.height}px;
  position: relative;
  background: ${props => props.theme.colors.black};
  h2 {
    margin: 0;
    line-height: 1.2;
  }
`
const TextWrapper = styled(Flex)`
  position: relative;
  z-index: 2;
  height: 100%;
  overflow: hidden;
`
const TextWrapperCopy = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  padding-top: ${header.height}px;
  height: 100%;
  color: ${props => props.theme.colors.black};
  z-index: 1;
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

const fontSizes = [4, 4, '5.75vw']

class HeaderIntro extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      x: 0.0,
      y: 0.0,
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

  onScroll({ offset: { y } }) {    
    this.setState({
      x: y / Viewport.height * 0.7,
      y: y * 0.4,
    })
  }

  render() {
    const { transitionStatus, intl } = this.props;
    const { x, y } = this.state;

    return (
      <Box
        as={Header}
        initialPose={`init`}
        pose={`entered`}
        className={`z-negative`}
      >
        <Flex as={TextWrapper} flexDirection={`column`} justifyContent={`center`} width={`100%`}>
          <Text
            as={`h2`}
            fontSize={fontSizes}
            textAlign="center"
            className={`is-serif fw-200`}
            style={{transform: `translate3d(${(x || 0) * -200}px, ${y}px, 0)`}}
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
            as={`h2`}
            fontSize={fontSizes}
            textAlign="center"
            className={`is-normal is-sans fw-300`}
            style={{transform: `translate3d(${(x || 0) * 200}px, ${y}px, 0)`}}
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

        <Flex as={TextWrapperCopy} flexDirection={`column`} justifyContent={`center`} width={`100%`}>
          <Text
            as={`h2`}
            fontSize={fontSizes}
            textAlign="center"
            className={`is-serif fw-200`}
            style={{transform: `translate3d(${(x || 0) * -200}px, ${y}px, 0)`}}
          >
            <SplitText>
              {intl.formatMessage({ id: 'Craft, code and smile.' }).toString()}
            </SplitText>
          </Text>

          <Text
            as={`h2`}
            fontSize={fontSizes}
            textAlign="center"
            className={`is-normal is-sans fw-300`}
            style={{transform: `translate3d(${(x || 0) * 200}px, ${y}px, 0)`}}
          >
            <SplitText>
              {intl.formatMessage({ id: 'We are a digital agency.' }).toString()}
            </SplitText>
          </Text>
        </Flex>

        <HeaderCircle />
      </Box>
    )
  }
}

export default injectIntl(HeaderIntro)
