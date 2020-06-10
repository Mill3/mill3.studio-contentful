import React from 'react'
import styled from 'styled-components'
import { Box, Heading } from 'rebass'
import TransitionContainer from '@components/transitions/TransitionContainer'

export const AboutSectionHeading = props => {
  const { heading, children } = props

  return (
    <TransitionContainer>
      <Heading as={heading || `h2`} fontFamily="serif" {...props}>
        <Box as={HeadingStyleInner} fontSize={['8.2vw', null, '6.5vw', '6.25vw', '5.5vw']}>
          {children}
        </Box>
      </Heading>
    </TransitionContainer>
  )
}

export const AboutSectionContainer = styled.section`
  min-height: 65vh;

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    min-height: 85vh;
  }
`

export const HeadingStyleInner = styled.span`
  line-height: 1.125;
  font-weight: 300;
  strong {
    font-family: ${props => props.theme.fonts.sans};
    font-style: normal;
    font-weight: 500;
  }
`
