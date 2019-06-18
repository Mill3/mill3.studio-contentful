import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { injectIntl, intlShape } from 'react-intl'
import { Flex, Box } from 'rebass'
// import { TransitionState } from "gatsby-plugin-transition-link"
import posed from 'react-pose'

// import { LayoutConsumer } from '@components/contexts/LayoutContext'

import LayoutContext from '@components/contexts/LayoutContext'

import Container from '@styles/Container'
import TransitionLinkComponent from '@utils/TransitionLink'
import Nav from '@components/nav/index'
import Logo from '@svg/Logo'
import { colors } from '@styles/Theme'

import { TRANSITION_DURATION } from '@utils/constants'

const SiteHeaderPoses = posed.header({
  exited: {
    backgroundColor: colors.white,
  },
  enteringInverted: {
    transition: {
      backgroundColor: {
        delay: TRANSITION_DURATION,
      },
    },
  },
})

const SiteHeader = styled(SiteHeaderPoses)`
  background: ${props => props.theme.colors.white};
  position: relative;
  z-index: 1000;
`
const HeaderStyle = styled.div`
  height: ${props => props.theme.header.height}px;
`

// choose animation for header
const pose = withIntro => {
  //console.log('withIntro:', withIntro)
  if (withIntro) {
    return 'enteringInverted'
  } else {
    return 'entered'
  }
}

class Header extends React.Component {

  intro(options) {
    const HeaderIntroElement = options.headerIntroComponent || null
    return (
      HeaderIntroElement ? <HeaderIntroElement transitionStatus={'entering'} /> : <></>
    )
  }

  render() {
    return (
      <LayoutContext.Consumer>
        {({ options }) => (
          <Box as={SiteHeader} pose={pose(options.withIntro)} mb={[5]}>
            {/* {console.log(options)} */}
            <Container fluid className={`z-10`}>
              <Flex as={HeaderStyle} flexWrap={`wrap`} alignItems={`center`} pt={[3, 4, '62px']}>
                <Box width={'auto'} className={`is-relative z-20`}>
                  <TransitionLinkComponent to={`/`} title={`Direction home`} color={`#000000`}>
                    <Logo inverted={options.withIntro} />
                  </TransitionLinkComponent>
                </Box>
                <Box width={'auto'} ml={`auto`} mr={[3, null, 0]}>
                  <Nav inverted={options.withIntro} />
                </Box>
              </Flex>
            </Container>
            {this.intro(options)}
          </Box>
        )}
      </LayoutContext.Consumer>
    )
  }
}

Header.propTypes = {
  intl: intlShape.isRequired,
}

Header.defaultProps = {
}

export default injectIntl(Header)
