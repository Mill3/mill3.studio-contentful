import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { Box, Flex, Text } from 'rebass'
import { injectIntl } from 'react-intl'
import memoize from 'memoize-one'

import { ArrowButton } from '@components/buttons'
import { charPoses } from '@components/header/HeaderIntro'

const DemoReelPoses = posed.section({
  inactive: {
    opacity: 0,
    transition: {
      type: 'tween',
      delay: 1000,
      duration: 0,
    },
  },
  active: {
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 0,
      duration: 0,
    },
  }
})
const ButtonPoses = posed.p({
  default: {
    y: 40,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 500,
    }
  }
})
const ClosePoses = posed.div({
  default: {
    y: -40,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 500,
    }
  }
})


const DemoReelStyle = styled(DemoReelPoses)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 10;
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
`
const TitleStyle = styled.h2`
  display: flex;
  flex-direction: column;
  line-height: 1.18;
  margin: 0;
  padding: 0;

  &>span:nth-child(2) {
    font-family: ${props => props.theme.fonts.sans};
    text-transform: uppercase;
  }
  &>span:nth-child(3) {
    font-style: italic;
  }
`
const ButtonReset = styled.button`
  border: none;
  background: none;
  border-radius: 0;
  outline: none !important;
  cursor: pointer;
`

class DemoReel extends Component {
  static contextTypes = {
    layoutState: PropTypes.object,
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.changeScrollbarPauseStatus = memoize((pause, trigger) => {
      if( this.scrollbar ) this.scrollbar.updatePluginOptions('pause', { pause: pause })
      return pause
    })
  }

  componentDidMount() { this.context.getScrollbar(s => this.scrollbar = s) }

  close() { this.context.layoutState.setDemoReel(false) }

  render() {
    const { intl } = this.props
    const { active, trigger } = this.context.layoutState.demoReel

    const title = intl.formatMessage({ id: 'demoReel.Title' }).split("<br />")

    this.changeScrollbarPauseStatus(active, trigger)

    return (
      <Flex
        as={DemoReelStyle}
        className="full-vh"
        visible={active}
        initialPose={'inactive'}
        pose={active ? 'active': 'inactive'}
      >
        <Flex width={['40%']} height={['100%']} flexDirection="column" justifyContent="space-between" px={[5]} py={['90px']}>
          <Text as={TitleStyle} fontFamily={"serif"} fontWeight="300" fontSize={[3, null, 4, 5, '100px']} color="white">
            {title.map((text, index) =>
              <Text as="span" key={index}>
                <SplitText
                  initialPose={`out`}
                  pose={active ? `enter` : `out`}
                  startDelay={index * 250 + 250}
                  charPoses={charPoses}
                >
                  {text}
                </SplitText>
              </Text>
            )}
          </Text>

          <Text as={ButtonPoses} m={0} p={0} initialPose={'default'} pose={active ? 'visible' : 'default'}>
            <Box as={ButtonReset} m={[0]} p={0} onClick={() => this.close()}>
              <ArrowButton color={"white"}>{intl.formatMessage({ id: 'demoReel.Button' })}</ArrowButton>
            </Box>
          </Text>
        </Flex>

        <Flex justifyContent="flex-end" width={['60%']} px={[5]} py={['90px']}>
          <Box as={ClosePoses} initialPose={'default'} pose={active ? 'visible' : 'default'}>
            <Box as={ButtonReset} m={[0]} p={0} onClick={() => this.close()}>
              <ArrowButton arrow={false} color="white">{intl.formatMessage({ id: 'demoReel.Close' })}</ArrowButton>
            </Box>
          </Box>
        </Flex>
      </Flex>
    )
  }
}

export default injectIntl(DemoReel)
