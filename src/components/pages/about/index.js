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
