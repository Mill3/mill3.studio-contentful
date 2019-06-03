import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'

import {
  TRANSITION_DURATION,
  TRANSITION_DELAY,
  TRANSITION_EXIT_DURATION
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
        duration: (TRANSITION_DURATION * 3) * 1000,
      },
      marginBottom: {
        type: 'tween',
        ease: 'backInOut',
        duration: (TRANSITION_DURATION * 3) * 1000,
      },
      height: {
        type: 'tween',
        ease: 'backInOut',
        duration: (TRANSITION_DURATION * 3) * 1000,
      }
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
        duration: (TRANSITION_EXIT_DURATION) * 1000,
      },
      height: {
        type: 'tween',
        ease: 'backInOut',
        duration: (TRANSITION_EXIT_DURATION) * 1000,
      }
    },
  },
})


const Header = styled(HeaderIntroPoses)`
  color: #fff;
  padding-top: 120px;
  top: -120px;
  position: relative;
  background: ${props => props.theme.colors.black};
  h2 {
    margin: 0;
    line-height: 1.2;
  }
`

const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => (TRANSITION_DURATION * 1500) + (charIndex * 30),
    transition: {
      y: {
        type: 'spring'
      }
    }
  }
};

const fontSizes = [4,4,'3.5vw']

const HeaderIntro = ({ transitionStatus, intl }) => {
  return (
    <Flex
      alignItems={`center`}
      as={Header}
      initialPose={`init`}
      pose={`entered`}
      className={`z-negative`}
    >
      <Box pl={[`5vw`,`8vw`]}>

        <Text as={`h2`} fontSize={fontSizes} className={`is-serif fw-200`}>
          <SplitText
            initialPose={`exit`}
            pose={['entering', 'entered'].includes(transitionStatus) ? `enter` : `exit`}
            charPoses={charPoses}
          >
            {intl.formatMessage({id: 'Craft, code and smile.'}).toString()}
          </SplitText>
        </Text>

        <Text as={`h2`} fontSize={fontSizes} className={`is-normal is-sans fw-300`}>
          <SplitText
            initialPose={`exit`}
            pose={['entering', 'entered'].includes(transitionStatus) ? `enter` : `exit`}
            charPoses={charPoses}
          >
            {intl.formatMessage({id: 'We are a digital agency.'}).toString()}
          </SplitText>
        </Text>

      </Box>

      <HeaderCircle />

    </Flex>
  );
}

export default injectIntl(HeaderIntro);