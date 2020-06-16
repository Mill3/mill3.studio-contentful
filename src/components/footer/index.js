import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import { injectIntl } from 'gatsby-plugin-intl'

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
const Networks = styled.nav`
  a {
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -11px;
      display: block;
      width: 3px;
      height: 3px;
      border-radius: 100%;
      background: #000;
      margin-top: -1px;
    }

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`

const NETWORKS = [{
  name: 'Facebook',
  url: 'https://facebook.com/Mill3studio/',
}, {
  name: 'LinkedIn',
  url: 'https://linkedin.com/company/le-moulin/',
}, {
  name: 'Instagram',
  url: 'https://www.instagram.com/mill3.studio/',
}, {
  name: 'Behance',
  url: 'https://behance.net/MILL3',
}]

const Footer = ({ intl }) => {

  const season = () => {
    let d = new Date()
    let m = d.getMonth()
    return (m >= 0 && m <= 2) || (m > 9) ? `winter` : `summer`
  }

  return (
    <Box mt={[4, 5]} pt={[4]} pb={[4]} as={FooterContainer}>
      <AnimatedBackgroundContainer backgroundColor="#ffffff">
        <Container fluid>
          <Flex
            flexDirection={['column', null, 'row']}
            alignItems={[null, null, "baseline"]}
            justifyContent={[null, null, "space-between"]}
            flexWrap={[null, null, 'wrap']}
          >

            <Box as={`aside`} width={[1, null, 'auto', '35%']} maxWidth={[null, null, null, 444]} order={0}>
              <TransitionContainer distance={0} autoCalculateDelay={false} index={0}>
                <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-900`}>
                  {intl.formatMessage({ id: 'footer.stopBy' }).toString()}
                </Text>
                <Text as={`h6`} m={0}>
                  {intl.formatMessage({ id: 'footer.home' }).toString()}
                  <br />
                  {intl.formatMessage({ id: 'footer.areas' }).toString()}
                </Text>
                {/*
                <Text as={`h6`} m={0}>
                  {intl.formatMessage({ id: 'footer.address' }).toString()}
                  <br />
                  {intl.formatMessage({ id: 'footer.city' }).toString()}
                  <br />
                  {intl.formatMessage({ id: 'footer.office' }).toString()}
                </Text>
                */}
              </TransitionContainer>
            </Box>

            <Box
              as={`aside`}
              width={[1, null, 'auto', '35%']}
              mt={[5, null, 0]}
              order={1}
            >
              <TransitionContainer distance={0} autoCalculateDelay={false} index={0.5}>
                <Text as={`h6`} mb={[2, 2, 3]} className={`is-serif fw-900`}>
                  {intl.formatMessage({ id: 'footer.hi' }).toString()}
                </Text>
                <Text as={`h6`} m={0}>
                  <a href={`mailto:${intl.formatMessage({ id: 'footer.email' }).toString()}`}>{intl.formatMessage({ id: 'footer.email' }).toString()}</a>
                  <br />
                  <a href="tel:+1514984-7703">{intl.formatMessage({ id: 'footer.phone' }).toString()}</a>
                </Text>
              </TransitionContainer>
            </Box>

            <Box
              as={`aside`}
              width={[1, null, `auto`]}
              mt={[5, null, 0]}
              order={2}
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

            <Flex as={Networks} width={[1, null, "auto", 0.5]} order={[0, null, 3]} m={0} mt={[3, null, 4]} p={0} className="is-sans fw-400">
              {NETWORKS.map(({name, url}, index) =>
                <Text
                  as={'a'}
                  key={index}
                  href={url || "#"}
                  target="_blank"
                  color="#000"
                  fontSize={['13px', 'inherit']}
                  mx={['10px']}
                >{name}</Text>
              )}
            </Flex>

            <Text as={`p`} width="auto" order={[4]} m={0} mt={[5, null, 4]} p={0} fontSize={[0, 1]} className={`is-gray`}>
              {intl.formatMessage({ id: 'footer.rights' }).toString()}
            </Text>

          </Flex>
        </Container>
      </AnimatedBackgroundContainer>
    </Box>
  )
}

export default injectIntl(Footer)
