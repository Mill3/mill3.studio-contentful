import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { injectIntl, intlShape } from 'react-intl'
import { Flex, Box } from 'rebass'
// import { TransitionState } from "gatsby-plugin-transition-link"
import posed from 'react-pose'

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
        delay: TRANSITION_DURATION * 1000,
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
  if (withIntro) {
    return 'enteringInverted'
  } else {
    return 'entered'
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() {
    const { withIntro, introComponent, intl: { locale } } = this.props
    const IntroComponent = introComponent || null

    return (
      <Box as={SiteHeader} pose={pose()} mb={[5]}>
        <Container fluid className={`z-10`}>
          <Flex as={HeaderStyle} flexWrap={`wrap`} alignItems={`center`} pt={[3, 4, '62px']}>
            <Box width={'auto'} className={`is-relative z-20`}>
              <TransitionLinkComponent to={`/`} title={`Direction home`} color={`#000000`}>
                <Logo inverted={withIntro} />
              </TransitionLinkComponent>
            </Box>
            <Box width={'auto'} ml={`auto`} mr={[3, null, 0]}>
              <Nav inverted={withIntro} />
            </Box>
          </Flex>
        </Container>

        {withIntro && IntroComponent && <IntroComponent transitionStatus={'entering'} />}
      </Box>
    );
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
  intl: intlShape.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default injectIntl(Header)
