// import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { Flex, Box } from 'rebass'

import LocalizedLink from '@utils/LocalizedLink'
import Switcher from '@components/switcher'
import Nav from '@components/nav'

import Logo from '@svg/Logo'

import Container from '@styles/Container'

const HeaderContext = React.createContext('light');

const fadeHeader = keyframes`
  from {
    background: #fff;
  }
  to {
    background: #000;
  }
`

const SiteHeader = styled.header`
  /* background-color: ${props => props.withIntro ? 'black' : 'transparent'}; */
  animation-name: ${props => props.withIntro ? fadeHeader : 'none'};
  animation-duration: 1s;
  animation-fill-mode: forwards;
`

const fadeIntro = keyframes`
  from {
    height: 0;
  }
  to {
    height: 30vh;
  }
`

const SiteHeaderIntro = styled.hgroup`
  color: #fff;
  height: 0;
  overflow: hidden;
  animation-name: ${fadeIntro};
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-delay: 1s;
`



const Header = ({ siteTitle, withIntro, intl: { locale } }) => (
  <HeaderContext.Provider value={'light'}>

    <Box as={SiteHeader} withIntro={withIntro} pt={[3,4]} pb={[3,4]}>

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
          <Flex alignItems={`center`} as={SiteHeaderIntro}>
            <Box pl={[1,2,4]}>
              <h1>Craft, code and smile.</h1>
              <h1>We are a digital agency. </h1>
            </Box>
          </Flex>
        }

      </Container>

    </Box>

  </HeaderContext.Provider>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  intl: intlShape.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default injectIntl(Header)
