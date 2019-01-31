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
    y: `100vh`,
    marginBottom: 500,
    height: `100vh`,
  },
  entered: {
    y: 0,
    marginBottom: 0,
    height: `60vh`,
    transition: {
      y: {
        type: 'tween',
        duration: (TRANSITION_DURATION * 1.5) * 1000,
      },
      marginBottom: {
        type: 'tween',
        duration: (TRANSITION_DURATION * 1.5) * 1000,
        delay: (TRANSITION_DURATION * 3) * 1000,
      },
      height: {
        type: 'tween',
        duration: (TRANSITION_DURATION * 1.5) * 1000,
      }
    },
  },
  exiting: {
    y: `-50vh`,
    height: `0vh`,
    transition: {
      y: {
        type: 'tween',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
      marginBottom: {
        type: 'tween',
        duration: (TRANSITION_EXIT_DURATION) * 1000,
      },
      height: {
        type: 'tween',
        duration: (TRANSITION_EXIT_DURATION) * 1000,
      }
    },
  },
})


const Header = styled(HeaderIntroPoses)`
  color: #fff;
  /* height: 60vh; */
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
    delay: ({ charIndex }) => (TRANSITION_DURATION * 2500) + (charIndex * 30),
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
      pose={transitionStatus}
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