import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import { injectIntl } from 'react-intl'

import { AnimatedBackgroundContainer } from '@components/content_rows'
import Container from '@styles/Container'
import TransitionContainer from '@components/transitions/TransitionContainer'

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

  const season = () => {
    let d = new Date()
    let m = d.getMonth()

    return (m >= 0 && m <=4) || (m > 9) ? `winter` : `summer`
  }

  return (
    <Box mt={[4, 5]} pt={[4]} pb={[4]} as={FooterContainer}>
      <AnimatedBackgroundContainer backgroundColor="#ffffff">
        <Container fluid>
          <Flex flexWrap={'wrap'}>

            <Box as={`aside`} width={[1, 1, 1, '444px']}>
              <TransitionContainer distance={0} autoCalculateDelay={false} index={0}>
                <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-900`}>
                  {intl.formatMessage({ id: 'footer.stopBy' }).toString()}
                </Text>
                <Text as={`h6`} m={0}>
                  {intl.formatMessage({ id: 'footer.address' }).toString()}
                  <br />
                  {intl.formatMessage({ id: 'footer.city' }).toString()}
                  <br />
                  {intl.formatMessage({ id: 'footer.office' }).toString()}
                </Text>
              </TransitionContainer>
            </Box>

            <Box
              as={`aside`}
              width={[1, 1, 1, 'auto']}
              mt={[4, 4, 4, 0]}
            >
              <TransitionContainer distance={0} autoCalculateDelay={false} index={0.5}>
                <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-900`}>
                  {intl.formatMessage({ id: 'footer.hi' }).toString()}
                </Text>
                <Text as={`h6`} m={0}>
                  <a href="mailto:{intl.formatMessage({ id: 'footer.email' }).toString()}">{intl.formatMessage({ id: 'footer.email' }).toString()}</a>
                  <br />
                  <a href="tel:+1514984-7703">{intl.formatMessage({ id: 'footer.phone' }).toString()}</a>
                </Text>
              </TransitionContainer>
            </Box>

            <Box
              as={`aside`}
              width={[1, 1, 1, `auto`]}
              ml={[0, 0, `auto`]}
              mt={[4, 4, 4, 0]}
            >
              <TransitionContainer distance={0} autoCalculateDelay={false} index={0.75}>
                <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-900`}>
                  {intl.formatMessage({ id: season() === 'winter' ? 'footer.cold' : 'footer.hot' }).toString()}
                </Text>
                <Text as={`h6`} m={0}>
                  {intl.formatMessage({ id: 'footer.love' }).toString()}
                  <br />
                  {intl.formatMessage({ id: 'footer.mtl' }).toString()}
                </Text>
              </TransitionContainer>
            </Box>

            <Box as={'aside'} width={[1]} mt={[5]}>
              <Text as={`p`} m={0} fontSize={[1]} className={`is-gray`}>
                {intl.formatMessage({ id: 'footer.rights' }).toString()}
              </Text>
            </Box>

          </Flex>
        </Container>
      </AnimatedBackgroundContainer>
    </Box>
  )
}

export default injectIntl(Footer)
