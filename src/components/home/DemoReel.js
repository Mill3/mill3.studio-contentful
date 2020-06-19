import React, { Component } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { Box, Flex, Text } from 'rebass'
import { injectIntl } from 'gatsby-plugin-intl'
import memoize from 'memoize-one'

import { LayoutContext } from '@layouts/layoutContext'
import { ArrowButton } from '@components/buttons'
import { charPoses } from '@components/header/HeaderIntro'
import Viewport from '@utils/Viewport'

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
    transition: {
      opacity: {
        type: 'tween',
        duration: 250,
        delay: 200,
        ease: 'linear',
      },
      y: {
        type: 'tween',
        duration: 450,
        ease: 'backIn',
      },
    }
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      opacity: {
        type: 'tween',
        duration: 350,
        ease: 'linear',
      },
      y: {
        type: 'tween',
        duration: 650,
        ease: 'backOut',
      },
    },
    delay: 1250,
  }
})
const ClosePoses = posed.div({
  default: {
    y: -40,
    opacity: 0,
    transition: {
      opacity: {
        type: 'tween',
        duration: 250,
        delay: 200,
        ease: 'linear',
      },
      y: {
        type: 'tween',
        duration: 450,
        ease: 'backIn',
      },
    }
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      opacity: {
        type: 'tween',
        duration: 350,
        ease: 'linear',
      },
      y: {
        type: 'tween',
        duration: 650,
        ease: 'backOut',
      },
    },
    delay: 1250,
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
const ScrollerStyle = styled.div`
  overflow-y: scroll;

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    overflow: hidden;
  }  
`
const TitleStyle = styled.h2`
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
  // static contextTypes = {
  //   layoutState: PropTypes.object,
  //   getScrollbar: PropTypes.func,
  // }

  constructor(props) {
    super(props)

    this.y = 0
    this.resumeY = 0
    this.scrollbar = null

    this.changeScrollbarPauseStatus = memoize((pause, trigger) => {
      if( this.scrollbar && pause === true ) {
        const { y, height } = trigger.getBoundingClientRect()

        // snap trigger element to viewport's top
        this.y = y + this.scrollbar.offset.y

        // vertically centered trigger element
        this.resumeY = this.y + (height - window.innerHeight) * 0.5

        // scroll to triggered element
        this.scrollbar.scrollTo(0, this.y, 850, {
          callback: () => {
            // pause scrollbar
            this.scrollbar.updatePluginOptions('pause', { pause: pause })
          },
        })
      }
      else if( this.scrollbar && pause === false ) {
        // wait for animation to complete
        setTimeout(() => {
          // resume scrollbar
          this.scrollbar.updatePluginOptions('pause', { pause: pause })

          // vertically center element that opened DemoReel into viewport
          this.scrollbar.scrollTo(0, this.resumeY, 450);
        }, 850);
      }

      return pause
    })
    this.onActiveChange = memoize(active => {
      if( !Viewport.exists ) return active

      if( active ) window.addEventListener('keydown', this.onKeyDown)
      else window.removeEventListener('keydown', this.onKeyDown)

      return active
    })

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidUpdate() {
    if(this.scrollbar) return
    if(this.context.layoutState.scrollbar) {
      this.scrollbar = this.context.layoutState.scrollbar
    }
  }
  onKeyDown({ key }) {
    if(key === 'Escape' || key === 'Esc') this.close()
  }

  close() {
    this.context.dispatch({type: 'demoReel.stop'})
  }
  render() {
    const { intl } = this.props
    const { active, trigger } = this.context.layoutState.demoReel
    const title = intl.formatMessage({ id: 'demoReel.Title' }).split("<br />")
    // console.log('active, trigger:', active, trigger)

    this.changeScrollbarPauseStatus(active, trigger)
    this.onActiveChange(active)

    return (
      <Box
        as={DemoReelStyle}
        visible={active}
        initialPose={'inactive'}
        pose={active ? 'active': 'inactive'}
        className="full-vh"
        style={{transform: `translateY(${this.y}px)`}}
      >
        <Box as={ClosePoses} initialPose={'default'} pose={active ? 'visible' : 'default'} css={{position: 'absolute', top: 0, right: 0}}>
          <Box as={ButtonReset} m={[0]} mt={[4, null, 5, '90px']} mr={[24, 4, 5]} p={0} onClick={() => this.close()}>
            <ArrowButton arrow={false} color="white">{intl.formatMessage({ id: 'demoReel.Close' })}</ArrowButton>
          </Box>
        </Box>

        <Flex as={ScrollerStyle} flexDirection={["column", null, null, "row-reverse"]} width={1} height={"100%"}>
          {/* video placeholder */}
          <Box
            flexGrow={[0, null, null, 1]}
            width={[1, null, null, '60%']}
            height={[0, null, null, '100%']}
            pb={['100%', null, null, 0]}
          />

          {/* content */}
          <Flex
            width={[1, null, null, '40%']}
            height={['auto', null, null, '100%']}
            flexGrow={1}
            flexDirection="column"
            justifyContent="space-between"
            px={[24, 4, 5]}
            py={[4, null, 5, '90px']}
            bg="black"
          >
            <Text
              as={TitleStyle}
              display={['block', null, null, 'flex']}
              flexDirection={['column']}
              fontFamily={"serif"}
              fontWeight="300"
              fontSize={['18vw', null, '9.3vw', '6.944444444vw']}
              lineHeight={[1.08, null, 1.18]}
              color="white"
            >
              {title.map((text, index) =>
                <Text as="span" key={index}>
                  <SplitText
                    initialPose={`out`}
                    pose={active ? `enter` : `out`}
                    startDelay={index * 250 + 950}
                    charPoses={charPoses}
                  >
                    {text}
                  </SplitText>
                </Text>
              )}
            </Text>

            <Text as={ButtonPoses} m={0} mt={[3, null, 4, 0]} p={0} initialPose={'default'} pose={active ? 'visible' : 'default'}>
              <Box as={ButtonReset} m={[0]} p={0} onClick={() => this.close()}>
                <ArrowButton color={"white"}>{intl.formatMessage({ id: 'demoReel.Button' })}</ArrowButton>
              </Box>
            </Text>
          </Flex>
        </Flex>
      </Box>
    )
  }
}

DemoReel.contextType = LayoutContext;

export default injectIntl(DemoReel)
