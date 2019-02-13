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

import {
  TRANSITION_DURATION,
  TRANSITION_DELAY,
  TRANSITION_EXIT_DURATION
} from '@utils/constants'

const SiteHeaderPoses = posed.header({
  exited: {
    backgroundColor: colors.white,
  },
  enteringInverted: {
    transition: {
      backgroundColor: {
        delay: TRANSITION_DURATION * 1000
      }
    }
  }
})

const SiteHeader = styled(SiteHeaderPoses)`
  background: ${props => props.theme.colors.white};
  position: relative;
  z-index: 1000;
`

const Header = ({ siteTitle, withIntro, intl: { locale } }) => (
  <TransitionState>
    {({ transitionStatus }) => {

      // choose animation for header
      const pose = (transitionStatus) => {
        if (withIntro && ['entering', 'entered'].includes(transitionStatus)) {
          return 'enteringInverted'
        } else {
          return ['entering', 'entered'].includes(transitionStatus) ? 'entered' : 'exited'
        }
      }

      return (
        <Box
          as={SiteHeader}
          pose={pose(transitionStatus)}
          mb={[5]}
        >

          <Container fluid className={`z-10`}>

            <Flex flexWrap={`wrap`} alignItems={`center`} pt={[3,4]} pb={[3,4]}>

              <Box width={[1,1,'auto']} pl={[2]}>
                <h1>
                  <TransitionLinkComponent to={`/`} title={`Direction home`} color={`#000000`}>
                    <Logo inverted={withIntro ? true : false} />
                  </TransitionLinkComponent>
                </h1>
              </Box>

              <Box width={[1,1,'auto']} ml={[0, 0, `auto`]}>
                <Nav inverted={withIntro} />
              </Box>

            </Flex>

          </Container>

          {withIntro &&
            <HeaderIntro transitionStatus={transitionStatus} />
          }

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
