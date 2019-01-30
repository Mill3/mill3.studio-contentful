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

const HeaderIntroPoses = posed.header({
  entered: {
    y: 0,
    transition: {
      y: {
        type: 'tween',
        duration: (TRANSITION_DURATION * 1.5) * 1000,
      },
    },
  },
  exiting: {
    y: `100vh`,
    transition: {
      y: {
        type: 'tween',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
    },
  },
})


const Header = styled(HeaderIntroPoses)`
  color: #fff;
  height: 50vh;
  padding-top: 90px;
  top: -90px;
  position: relative;
  background: ${props => props.theme.colors.black};
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
      initialPose={`exiting`}
      pose={transitionStatus}
      className={`z-negative`}
    >
      <Box pl={[2,`8vw`]}>
        <Text as={`h2`} fontSize={fontSizes} className={`is-normal is-serif fw-300`}>
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
    </Flex>
  );
}

export default injectIntl(HeaderIntro);