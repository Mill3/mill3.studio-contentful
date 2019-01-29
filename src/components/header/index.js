// import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { Flex, Box } from 'rebass'
import { TransitionState } from "gatsby-plugin-transition-link"
import posed from 'react-pose'

import Container from '@styles/Container'
import TransitionLinkComponent from '@utils/TransitionLink'
import HeaderIntro from '@components/header/HeaderIntro'
import Nav from '@components/nav/index'
import Logo from '@svg/Logo'
import { colors } from '@styles/Theme'

const SiteHeaderPoses = posed.header({
  init : {
    backgroundColor: `rgba(255,255,255,0)`,
  },
  default: {
    backgroundColor: `rgba(255,255,255,0)`,
  },
  withIntro: {
    skewY: `0deg`,
    backgroundColor: `${colors.black}`,
  },
})

const SiteHeader = styled(SiteHeaderPoses)`
  background: rgba(255,255,255,0);
`

const Header = ({ siteTitle, withIntro, intl: { locale } }) => (
  <TransitionState>
    {({ transitionStatus }) => {

      return (

        <Box
          as={SiteHeader}
          pose={
            withIntro && ['entering', 'entered'].includes(transitionStatus)
            ? `withIntro` : `default`
          }
          delay={0}
          pt={[3,4]}
          pb={[3,4]}
        >

          {/* {transitionStatus} */}

          <Container fluid>

            <Flex flexWrap={`wrap`} alignItems={`center`}>

              <Box width={[1,1,'auto']}>
                <h1>
                  <TransitionLinkComponent to={`/`} title={siteTitle}>
                    <Logo inverted={withIntro ? true : false} />
                  </TransitionLinkComponent>
                </h1>
              </Box>

              <Box width={[1,1,'auto']} ml={[0, 0, `auto`]}>
                <Nav inverted={withIntro} />
              </Box>

            </Flex>

            {withIntro &&
              <HeaderIntro transitionStatus={transitionStatus} />
            }

          </Container>

        </Box>

      )

    }}
  </TransitionState>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  intl: intlShape.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default injectIntl(Header)
