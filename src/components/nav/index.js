import React from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Text } from 'rebass'
import { FormattedMessage } from 'react-intl'

import Switcher from '@components/nav/switcher'
import TransitionLinkComponent from '@utils/TransitionLink'


const NavContainerPoses = posed.ul({
  hidden: {
    y: '-100%',
    delay: 200,
    staggerChildren: 35,
    staggerDirection: -1,
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    }
  },
  visible: {
    y: '0%',
    delayChildren: 350,
    staggerChildren: 50,
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    }
  }
})

const NavItemPoses = posed.li({
  hidden: {
    opacity: 0,
    transition: {
      duration: 175,
    }
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 250,
    }
  }
})

const NavWrapper = styled.nav`
  color: ${props => props.inverted ? props.theme.colors.white : props.theme.colors.black };

  a {
    color: ${props => props.inverted ? props.theme.colors.white : props.theme.colors.gray };
    display: inline-block;
    transition: color 0.75s;

    &:hover {
      color: ${props => props.theme.colors.black};
      text-decoration: none;
    }

    &[aria-current] {
      color: ${props => props.inverted ? props.theme.colors.white : props.theme.colors.black };
    }
  }
`

const NavBurger = styled.button`
  position: relative;
  z-index: 20;
  background: none;
  border: 0;
  outline: none;
  color: inherit;

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    display: none;
  }
`

const NavContainer = styled(NavContainerPoses)`
  background: ${props => props.inverted ? props.theme.colors.black : props.theme.colors.white};
  margin: 0;
  padding: 84px 0 0 0;
  list-style: none;
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: ${props => props.visible ? 'all' : 'none' };

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    background: none !important;
    padding: 0;
    position: relative;
    top: auto;
    left: auto;
    width: auto;
    height: auto;
    flex-wrap: nowrap;
    flex-direction: row;
    align-self: center;
    justify-content: center;
    pointer-events: all;
    transform: none !important;
  }
`

const NavItem = styled(NavItemPoses)`
  padding: 1.5vh 0;
  margin: 0;
  flex: 0 0 auto;

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    padding: 0 1.5vw;
    transform: none !important;
    opacity: 1 !important;
  }

  &:first-child {
    padding-top: 0;
    padding-left: 0;
  }

  &:last-child {
    padding-bottom: 0;
    padding-right: 0;
  }

`



const fontSizes = [5,5,3,3]

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    let { inverted } = this.props;
    let { visible } = this.state;

    return (
      <NavWrapper inverted={inverted}>

        <NavBurger onClick={e => this.toggle()}>Menu</NavBurger>

        <NavContainer initialPose={'hidden'} pose={visible ? 'visible' : 'hidden'} visible={visible} inverted={inverted}>

          <NavItem>
            <TransitionLinkComponent to={`/projects/`} title={`Work, work, work, work!`} color={`#000`}>
              <Text fontSize={fontSizes}>
                <FormattedMessage id="Work" />
              </Text>
            </TransitionLinkComponent>
          </NavItem>

          <NavItem>
            <TransitionLinkComponent to={`/about/`} title={`Yes, us`} color={`#445533`}>
              <Text fontSize={fontSizes}>
                <FormattedMessage id="About" />
              </Text>
            </TransitionLinkComponent>
          </NavItem>

          <NavItem>
            <TransitionLinkComponent to={`/journal/`}>
              <Text fontSize={fontSizes}>
                <FormattedMessage id="Journal" />
              </Text>
            </TransitionLinkComponent>
          </NavItem>

          <NavItem>
            <TransitionLinkComponent to={`/contact/`} title={`🤙`} color={`#3426F1`}>
              <Text fontSize={fontSizes}>
                <FormattedMessage id="Let's talk" />
              </Text>
            </TransitionLinkComponent>
          </NavItem>

          <NavItem>
            <Switcher fontSizes={fontSizes} />
          </NavItem>

        </NavContainer>

      </NavWrapper>
    );
  }
}

export default Nav
