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

// console.log(TRANSITION_DURATION * 1000);

const HeaderIntroPoses = posed.header({
  entered: {
    opacity: 1,
    transition: {
      height: {
        type: 'tween',
        duration: 200,
      },
    },
  },
  exiting: {
    opacity: 0,
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
  height: 38vh;
`

const charPoses = {
  exit: { opacity: 0, y: 30 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => charIndex * 10,
    transition: {
      y: {
        type: 'spring',
      },
    },
  }
};

const HeaderIntro = ({ transitionStatus }) => {
  return (
    <Flex
      alignItems={`center`}
      as={Header}
      pose={transitionStatus}
    >
      <Box pl={[1,2,4]}>
        <Text as={`h2`} fontSize={[4,5,'3.5vw']} className={`is-normal is-sans`}>
          {/* <FormattedMessage id="Craft, code and smile." /> */}
          <SplitText
            pose={['entering', 'entered'].includes(transitionStatus) ? `enter` : `exit`}
            charPoses={charPoses}
          >
            Craft, code and smile.
          </SplitText>
        </Text>
        <Text as={`h2`} fontSize={[4,5,'3.5vw']} className={`is-normal is-serif`}>
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