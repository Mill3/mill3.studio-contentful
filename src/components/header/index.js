import React, { useContext } from 'react'
import styled, { css } from 'styled-components'
import posed from 'react-pose'
import { useLocation } from '@reach/router'
import { injectIntl } from 'gatsby-plugin-intl'
import { Flex, Box } from 'rebass'

import { LayoutContext } from '@layouts/layoutContext'

import Container from '@styles/Container'
import Logo from '@svg/Logo'
import Nav from '@components/nav/index'
import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { TRANSITION_PANE_STATES, TRANSITION_INTRO_DELAY, TRANSITION_DURATION } from '@utils/constants'

const SiteHeaderPose = posed.header({
  visible: {
    y: 0,
    transition: {
      type: 'tween',
      duration: 450,
      delay: 250,
      ease: 'circOut',
    },
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  ${({ visible }) => (visible ? null : SiteHeaderDisabled)};
`
const HeaderStyle = styled.div`
  height: ${props => props.theme.header.height}px;
`

const Header = () => {
  const location = useLocation()
  const { layoutState } = useContext(LayoutContext)
  const { demoReel, invertedHeader, transition } = layoutState

  return (
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
        delayIn={
          transition.state === TRANSITION_PANE_STATES[`intro`] ? TRANSITION_INTRO_DELAY * 1.45 : TRANSITION_DURATION * 0.65
        }
      >
        <Container fluid className={`z-10`}>
          <Flex as={HeaderStyle} flexWrap={`wrap`} alignItems={`center`} py={'30px'}>
            <Box width={'auto'} className={`is-relative z-20`}>
              <TransitionLinkComponent to={`/`} title={`Home Sweet Home`} color={`blue`}>
                <Logo inverted={invertedHeader} />
              </TransitionLinkComponent>
            </Box>
            <Box width={['auto']} ml={`auto`} mr={0}>
              <Nav inverted={invertedHeader} pathname={location.pathname} />
            </Box>
          </Flex>
        </Container>
      </TransitionContainer>
    </Box>
  )
}

export default injectIntl(Header)
