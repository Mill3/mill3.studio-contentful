// import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { Flex, Box } from 'rebass'
import { TransitionState, TransitionPortal } from "gatsby-plugin-transition-link"

import LocalizedLink from '@utils/LocalizedLink'
import Nav from '@components/nav'

import Logo from '@svg/Logo'

import Container from '@styles/Container'

const fadeToBlack = keyframes`
  from {
    background: #fff;
  }
  to {
    background: #000;
  }
`

const fadeToWhite = keyframes`
  from {
    background: #000;
  }
  to {
    background: #fff;
  }
`

const pickHeaderAnimation = (transitionStatus, withIntro) => {
  if (withIntro) {
    switch (transitionStatus) {
      case 'entered':
        return fadeToBlack
        break
      case 'entering':
        return fadeToBlack
        break
      case 'exiting':
        return fadeToWhite
        break
      case 'exited':
        return fadeToWhite
        break
    }
  } else {
    return `none`
  }
}


const SiteHeader = styled.header`
  /* background-color: ${props => props.withIntro ? 'black' : 'transparent'}; */
  animation-name: ${props => props.keyframeName};
  animation-duration: 0.45s;
  animation-fill-mode: forwards;
`

const fadeInIntro = keyframes`
  to {
    height: 30vh;
  }
`

const fadeOutIntro = keyframes`
  from {
    height: 30vh;
    opacity: 1;
  }
  to {
    opacity: 0;
    height: 0vh;
  }
`

const pickIntroAnimation = (transitionStatus) => {
  switch (transitionStatus) {
    case 'entered':
      return fadeInIntro
      break
    case 'entering':
      return fadeInIntro
      break
    case 'exiting':
      return fadeOutIntro
      break
    case 'exited':
      return fadeOutIntro
      break
  }
}

const SiteHeaderIntro = styled.hgroup`
  color: #fff;
  height: 0;
  overflow: hidden;
  animation-name: ${props => props.keyframeName};
  animation-duration: 0.25s;
  animation-fill-mode: forwards;
`

const Header = ({ siteTitle, withIntro, intl: { locale } }) => (
  <TransitionState>
    {({ transitionStatus }) => {

      return (

        <Box as={SiteHeader} withIntro={withIntro} keyframeName={pickHeaderAnimation(transitionStatus, withIntro)} pt={[3,4]} pb={[3,4]}>

          {/* {transitionStatus} */}

          <Container fluid>

            <Flex flexWrap={`wrap`} alignItems={`center`}>

              <Box width={[1,1,'auto']}>
                <h1>
                  <LocalizedLink to={`/`} title={siteTitle}>
                    <Logo inverted={withIntro ? true : false} />
                  </LocalizedLink>
                </h1>
              </Box>

              <Box width={[1,1,'auto']} ml={[0, 0, `auto`]}>
                <Nav />
              </Box>

            </Flex>

            {withIntro &&
              <Flex alignItems={`center`} as={SiteHeaderIntro} keyframeName={pickIntroAnimation(transitionStatus)}>
                <Box pl={[1,2,4]}>
                  <h1>Craft, code and smile.</h1>
                  <h1>We are a digital agency. </h1>
                </Box>
              </Flex>
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
