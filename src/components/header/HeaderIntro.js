import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'
import posed from 'react-pose'

const HeaderIntroPoses = posed.header({
  default: {
    opacity: 0,
    height: '0vh'
  },
  entered: {
    transition: {
      height: {
        type: 'spring',
      }
    },
    opacity: 1,
    height: '30vh'
  },
})

const Header = styled(HeaderIntroPoses)`
  color: #fff;
  overflow: hidden;
`

const HeaderIntro = ({ transitionStatus }) => {
  return (
    <Flex
      alignItems={`center`}
      as={Header}
      pose={
        ['entering', 'entered'].includes(transitionStatus)
        ? `entered` : `default`
      }
      delay={0}
    >
      <Box pl={[1,2,4]}>
        <h1>Craft, code and smile.</h1>
        <h1>We are a digital agency. </h1>
      </Box>
    </Flex>
  );
}

export default HeaderIntro;