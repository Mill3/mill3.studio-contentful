import React from 'react'
import styled from 'styled-components'
import Container from '@styles/Container'
import { Flex, Box, Text } from 'rebass'

const FooterContainer = styled.footer`
  font-size: 18px;

  h6,
  p {
    &:not([font-size]) {
      font-size: inherit;
    }
  }
`

const Footer = () => {
  return (
    <Box mt={[4, 5]} pt={[4]} pb={[4]} as={FooterContainer}>
      <Container fluid>
        <Flex flexWrap={'wrap'}>

          <Box as={`aside`} width={[1, 1, 1, '444px']}>
            <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-300`}>
              Stop by.
            </Text>
            <Text as={`h6`} m={0}>
              1275 Avenue des Canadiens-de-Montréal
              <br />
              Montréal, Québec
              <br />
              5th Floor.
            </Text>
          </Box>

          <Box
            as={`aside`}
            width={[1, 1, 1, 'auto']}
            mt={[4, 4, 4, 0]}
          >
            <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-300`}>
              Say Hi !
            </Text>
            <Text as={`h6`} m={0}>
              <a href="mailto:info@mill3.studio">info@mill3.studio</a>
              <br />
              <a href="tel:+1514984-7703">+1 (514) 984-7703</a>
            </Text>
          </Box>

          <Box
            as={`aside`}
            width={[1, 1, 1, `auto`]}
            ml={[0, 0, `auto`]}
            mt={[4, 4, 4, 0]}
          >
            <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-300`}>
              Baby, it’s cold outside.
            </Text>
            <Text as={`h6`} m={0}>
              Made with love in
              <br />
              Montréal, Canada.
            </Text>
          </Box>

          <Box as={'aside'} width={[1]} mt={[5]}>
            <Text as={`p`} m={0} fontSize={[1]} className={`is-gray`}>
              Rights, Rights, Rights. Pretty sure @mill3studio
            </Text>
          </Box>

        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
