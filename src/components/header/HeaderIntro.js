import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  TRANSITION_DURATION,
  TRANSITION_DELAY,
  TRANSITION_EXIT_DURATION
} from '@utils/constants'

const HeaderIntroPoses = posed.header({
  init: {
    opacity: 0,
    height: 0,
    transition: {
      height: {
        type: 'tween',
        duration: TRANSITION_DURATION * 1000,
      },
    },
  },
  entered: {
    opacity: 1,
    height: `40vh`,
    transition: {
      height: {
        type: 'tween',
        duration: TRANSITION_DURATION * 1000,
      },
    },
  },
  exiting: {
    opacity: 0,
    height: 0,
    transition: {
      height: {
        type: 'tween',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
    },
  },
})


const Header = styled(HeaderIntroPoses)`
  color: #fff;
  height: 0;
`

const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => (TRANSITION_DURATION * 1250) + (charIndex * 30),
    transition: {
      y: {
        type: 'spring'
      }
    }
  }
};

const fontSizes = [4,4,'3.5vw']

const HeaderIntro = ({ transitionStatus }) => {
  return (
    <Flex
      alignItems={`center`}
      as={Header}
      pose={transitionStatus}
    >
      <Box pl={[2,`4vw`]}>
        <Text as={`h2`} fontSize={fontSizes} className={`is-normal is-serif fw-300`}>
          <SplitText
            pose={['entering', 'entered'].includes(transitionStatus) ? `enter` : `exit`}
            charPoses={charPoses}
          >
            Craft, code and smile.
          </SplitText>
        </Text>
        <Text as={`h2`} fontSize={fontSizes} className={`is-normal is-sans fw-300`}>
          <SplitText
            pose={['entering', 'entered'].includes(transitionStatus) ? `enter` : `exit`}
            charPoses={charPoses}
          >
            We are a digital agency.
          </SplitText>
        </Text>
      </Box>
    </Flex>
  );
}

export default injectIntl(HeaderIntro);