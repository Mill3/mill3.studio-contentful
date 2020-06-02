import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading } from 'rebass'

export const AboutSectionContainer = styled.section`
  min-height: 85vh;
  padding-top: 4vh;
  padding-bottom: 4vh;
`
export const HeadingStyleInner = styled.span`
  line-height: 1.125;
  font-weight: 300;
  em {
    font-family: ${props => props.theme.fonts.sans};
    font-style: normal;
    font-weight: 500;
  }
`

export const AboutSectionHeading = ({ heading, textAlign, children }) => {
  return (
    <Heading
      as={heading || `h2`}
      textAlign={textAlign || `left`}
      fontFamily="serif"
    >
      <Box
        as={HeadingStyleInner}
        fontSize={['9.2vw', null, '4.416666667vw', null, '4.433333333vw']}
        >
          {children}
      </Box>
    </Heading>
  )
}
