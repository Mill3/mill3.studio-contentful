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
import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { TRANSITION_INTRO_DELAY, TRANSITION_DURATION } from '@utils/constants'
import { TRANSITION_PANE_STATES } from '@components/transitions'

const SiteHeader = styled.header`
  position: relative;
  z-index: 1000;
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
          <Box as={SiteHeader} pt={[0, 0, 0, `24px`]}>
            <Container fluid className={`z-10`}>
              <Flex as={HeaderStyle} flexWrap={`wrap`} alignItems={`center`} py={'30px'}>
                <Box width={'auto'} className={`is-relative z-20`}>
                  <TransitionContainer distance={10} delayIn={layoutState.transitionState === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY * 1.45 : TRANSITION_DURATION * 0.65 }>
                    <TransitionLinkComponent to={`/`} title={`✌️`} color={`#000`}>
                      <Logo inverted={layoutState.options.inverted} />
                    </TransitionLinkComponent>
                  </TransitionContainer>
                </Box>
                <Box width={'auto'} ml={`auto`} mr={[0, null, 0]}>
                  <TransitionContainer distance={10} delayIn={layoutState.transitionState === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY * 1.6 : TRANSITION_DURATION * 0.75}>
                    <Nav inverted={layoutState.options.inverted} pathname={location.pathname} />
                  </TransitionContainer>
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
