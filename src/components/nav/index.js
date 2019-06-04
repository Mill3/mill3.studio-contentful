import React, { Component } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Text } from 'rebass'
import { FormattedMessage } from 'react-intl'

import Switcher from '@components/nav/switcher'
import TransitionLinkComponent from '@utils/TransitionLink'


const NavContainerPoses = posed.ul({
  hidden: {
    y: '-100%',
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    }
  },
  visible: {
    y: '0%',
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    }
  }
})

const NavContainer = styled(NavContainerPoses)`
  background: ${props => props.theme.colors.black};
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

const NavItem = styled.li`
  padding: 1.5vh 0;
  margin: 0;
  flex: 0 0 auto;

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    padding: 0 1.5vw;
  }

  &:first-child { padding-top: 0; }
  &:last-child { padding-bottom: 0; }
`

const NavWrapper = styled.nav`
  color: ${props => props.inverted ? 'white' : 'black' };

  a {
    color: ${props => props.inverted ? 'white' : 'black' };
    display: inline-block;
  }

  ${NavContainer} {
    background: ${props => props.theme.colors.white}
  }
`

const NavBurger = styled.button`
  position: relative;
  z-index: 20;
  background: none;
  border: 0;
  outline: none;

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    display: none;
  }
`

const fontSizes = [5,5,3,3]

class Nav extends Component {
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

        <NavContainer initialPose={'hidden'} pose={visible ? 'visible' : 'hidden'} visible={visible}>

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
