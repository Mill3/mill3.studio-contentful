import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'
import posed from 'react-pose'


import {
  TRANSITION_DURATION,
  TRANSITION_DELAY,
  TRANSITION_EXIT_DURATION
} from '@utils/constants'

// console.log(TRANSITION_DURATION * 1000);

const HeaderIntroPoses = posed.header({
  entered: {
    height: '30vh',
    transition: {
      height: {
        type: 'spring',
        stiffness: 750,
        damping: 15,
        // duration: (TRANSITION_DURATION * 2) * 1000,
      },
    },
  },
  exiting: {
    height: '0vh',
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
  overflow: hidden;
`

const HeaderIntro = ({ transitionStatus }) => {
  return (
    <Flex
      alignItems={`center`}
      as={Header}
      pose={transitionStatus}
    >
      <Box pl={[1,2,4]}>
        <h1>Craft, code and smile.</h1>
        <h1>We are a digital agency. </h1>
      </Box>
    </Flex>
  );
}

export default HeaderIntro;