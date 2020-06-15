import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import posed from 'react-pose'
import { Location } from '@reach/router'
import { injectIntl, intlShape } from 'react-intl'
import { Flex, Box } from 'rebass'

import Container from '@styles/Container'
import Logo from '@svg/Logo'
import Nav from '@components/nav/index'
import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { TRANSITION_INTRO_DELAY, TRANSITION_DURATION } from '@utils/constants'
import { TRANSITION_PANE_STATES } from '@components/transitions'


const SiteHeaderPose = posed.header({
  visible: {
    y: 0,
    transition: {
      type: 'tween',
      duration: 450,
      delay: 250,
      ease: 'circOut',
    }
  },
  hidden: {
    y: '-100%',
    transition: {
      type: 'tween',
      duration: 450,
      ease: 'circOut',
    },
  },
})
const SiteHeaderDisabled = css`
  &,
  * {
    pointer-events: none;
  }
`
const SiteHeader = styled(SiteHeaderPose)`
  position: relative;
  z-index: 1000;

  ${({ visible }) => (visible ? null : SiteHeaderDisabled)};
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
    const { demoReel } = layoutState

    return (
      <Location>
        {({ location }) => (
          <Box
            as={SiteHeader}
            pt={[0, 0, 0, `24px`]}
            defaultPose={'visible'}
            pose={demoReel.active ? 'hidden' : 'visible'}
            visible={!demoReel.active}
            withParent={false}
          >
            <TransitionContainer
              distance={10}
              disabledPose={'none'}
              delayIn={layoutState.transitionState === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY * 1.45 : TRANSITION_DURATION * 0.65 }
            >
              <Container fluid className={`z-10`}>
                <Flex as={HeaderStyle} flexWrap={`wrap`} alignItems={`center`} py={'30px'}>
                  <Box width={'auto'} className={`is-relative z-20`}>
                      <TransitionLinkComponent to={`/`} title={`Home Sweet Home`} color={`blue`}>
                        <Logo inverted={layoutState.invertedHeader} />
                      </TransitionLinkComponent>
                  </Box>
                  <Box width={['auto']} ml={`auto`} mr={[0, null, 0]}>
                    <Nav inverted={layoutState.invertedHeader} pathname={location.pathname} />
                  </Box>
                </Flex>
              </Container>
            </TransitionContainer>
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
