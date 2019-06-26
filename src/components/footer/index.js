import React from 'react'
import styled from 'styled-components'
import Container from '@styles/Container'
import { Flex, Box, Text } from 'rebass'
import { injectIntl } from 'react-intl'

const FooterContainer = styled.footer`
  font-size: 18px;

  h6,
  p {
    &:not([font-size]) {
      font-size: inherit;
    }
  }
`

const Footer = ({ intl }) => {
  return (
    <Box mt={[4, 5]} pt={[4]} pb={[4]} as={FooterContainer}>
      <Container fluid>
        <Flex flexWrap={'wrap'}>

          <Box as={`aside`} width={[1, 1, 1, '444px']}>
            <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-300`}>
              {intl.formatMessage({ id: 'footer.stopBy' }).toString()}
            </Text>
            <Text as={`h6`} m={0}>
              {intl.formatMessage({ id: 'footer.address' }).toString()}
              <br />
              {intl.formatMessage({ id: 'footer.city' }).toString()}
              <br />
              {intl.formatMessage({ id: 'footer.office' }).toString()}
            </Text>
          </Box>

          <Box
            as={`aside`}
            width={[1, 1, 1, 'auto']}
            mt={[4, 4, 4, 0]}
          >
            <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-300`}>
              {intl.formatMessage({ id: 'footer.hi' }).toString()}
            </Text>
            <Text as={`h6`} m={0}>
              <a href="mailto:{intl.formatMessage({ id: 'footer.email' }).toString()}">{intl.formatMessage({ id: 'footer.email' }).toString()}</a>
              <br />
              <a href="tel:+1514984-7703">{intl.formatMessage({ id: 'footer.phone' }).toString()}</a>
            </Text>
          </Box>

          <Box
            as={`aside`}
            width={[1, 1, 1, `auto`]}
            ml={[0, 0, `auto`]}
            mt={[4, 4, 4, 0]}
          >
            <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-300`}>
              {intl.formatMessage({ id: 'footer.cold' }).toString()}
            </Text>
            <Text as={`h6`} m={0}>
              {intl.formatMessage({ id: 'footer.love' }).toString()}
              <br />
              {intl.formatMessage({ id: 'footer.mtl' }).toString()}
            </Text>
          </Box>

          <Box as={'aside'} width={[1]} mt={[5]}>
            <Text as={`p`} m={0} fontSize={[1]} className={`is-gray`}>
              {intl.formatMessage({ id: 'footer.rights' }).toString()}
            </Text>
          </Box>

        </Flex>
      </Container>
    </Box>
  )
}

export default injectIntl(Footer)
