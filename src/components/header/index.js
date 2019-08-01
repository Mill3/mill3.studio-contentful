import React from 'react'
import styled from 'styled-components'
import { Location } from '@reach/router'
import { injectIntl, intlShape } from 'react-intl'
import { Flex, Box } from 'rebass'


import LayoutContext from '@components/contexts/LayoutContext'
import Nav from '@components/nav/index'

import Container from '@styles/Container'
import Logo from '@svg/Logo'
import TransitionLinkComponent from '@components/transitions/TransitionLink'


const SiteHeader = styled.header`
  position: relative;
  z-index: 1000;
`
const HeaderStyle = styled.div`
  height: ${props => props.theme.header.height}px;
`


class Header extends React.Component {
  render() {
    return (
      <Location>
        {({ location }) => (
          <LayoutContext.Consumer>
            {({ options }) => (
              <Box as={SiteHeader} pt={[0,0,0,`24px`]}>
                <Container fluid className={`z-10`}>
                  <Flex as={HeaderStyle} flexWrap={`wrap`} alignItems={`center`} py={'30px'}>
                    <Box width={'auto'} className={`is-relative z-20`}>
                      <TransitionLinkComponent to={`/`} title={`✌️`} color={`#000000`}>
                        <Logo inverted={options.inverted} />
                      </TransitionLinkComponent>
                    </Box>
                    <Box width={'auto'} ml={`auto`} mr={[3, null, 0]}>
                      <Nav inverted={options.inverted} pathname={location.pathname} />
                    </Box>
                  </Flex>
                </Container>
              </Box>
            )}
          </LayoutContext.Consumer>
        )}
      </Location>
    )
  }
}

Header.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(Header)
