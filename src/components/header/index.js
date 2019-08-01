import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import posed from 'react-pose'
import { Location } from '@reach/router'
import { injectIntl, intlShape } from 'react-intl'
import { Flex, Box } from 'rebass'

// import LayoutContext from '@components/contexts/LayoutContext'
import Nav from '@components/nav/index'

import Container from '@styles/Container'
import Logo from '@svg/Logo'
import { TRANSITION_PANE_STATES } from '@components/transitions'
import TransitionLinkComponent from '@components/transitions/TransitionLink'

const SiteHeader = styled.header`
  position: relative;
  z-index: 1000;
  transition: opacity 0.5s linear 0.25s;
  opacity: ${props => props.visible ? 1 : 0};
`

const HeaderStyle = styled.div`
  height: ${props => props.theme.header.height}px;
`

class Header extends React.Component {
  static contextTypes = {
    layoutState: PropTypes.object,
  }

  render() {
    const { layoutState } = this.context

    return (
      <Location>
        {({ location }) => (
          <Box as={SiteHeader} visible={layoutState.transitionState === TRANSITION_PANE_STATES['visible'] ? false : true} pt={[0, 0, 0, `24px`]}>
            <Container fluid className={`z-10`}>
              <Flex as={HeaderStyle} flexWrap={`wrap`} alignItems={`center`} py={'30px'}>
                <Box width={'auto'} className={`is-relative z-20`}>
                  <TransitionLinkComponent to={`/`} title={`✌️`} color={`#000000`}>
                    <Logo inverted={layoutState.options.inverted} />
                  </TransitionLinkComponent>
                </Box>

                <Box width={'auto'} ml={`auto`} mr={[3, null, 0]}>
                  <Nav inverted={layoutState.options.inverted} pathname={location.pathname} />
                </Box>
              </Flex>
            </Container>
          </Box>
        )}
      </Location>
    )
  }
}

Header.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(Header)
