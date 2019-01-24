// import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { Flex, Box } from 'rebass'

import LocalizedLink from '@utils/LocalizedLink'
import Switcher from '@components/switcher'

import Logo from '@svg/Logo'

import Container from '@styles/Container'

const SiteHeader = styled.header`
  /* border: 1px solid rebeccapurple; */
  /* padding-top:  */
`

const Header = ({ siteTitle, intl: { locale } }) => (
  <Box as={SiteHeader} pt={[3,4]} pb={[3,4]}>

    <Container fluid>

      <Flex>

      <Box width={[1,2/3]}>

        <h1>
          <LocalizedLink to={`/`} title={siteTitle}>
            <Logo />
          </LocalizedLink>
        </h1>

      </Box>

        <Box width={['auto']} ml={`auto`}>

          <Switcher />

        </Box>

      </Flex>

    </Container>

  </Box>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  intl: intlShape.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default injectIntl(Header)
