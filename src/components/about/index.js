import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading } from 'rebass'
import TransitionContainer from '@components/transitions/TransitionContainer'

export const AboutSectionHeading = props => {
  const { heading, children } = props

  return (
    <TransitionContainer>
      <Heading as={heading || `h2`} fontFamily="serif" {...props}>
        <Box as={HeadingStyleInner} fontSize={['9.2vw', null, '4.433333333vw']}>
          {children}
        </Box>
      </Heading>
    </TransitionContainer>
  )
}

export const AboutSectionContainer = styled.section`
  min-height: 85vh;
  p, h1, h2, h3, h4, h5 {
    transform: translate3d(0, 0px, 0);
    will-change: color;
    transition: color 0.25s linear;
  }
`
export const HeadingStyleInner = styled.span`
  line-height: 1.125;
  font-weight: 300;
  display: flex;
  strong {
    font-family: ${props => props.theme.fonts.sans};
    font-style: normal;
    font-weight: 500;
  }
`
