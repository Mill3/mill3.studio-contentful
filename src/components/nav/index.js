import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Text } from 'rebass'
import { injectIntl, FormattedMessage } from "gatsby-plugin-intl"

import { colors } from '@styles/Theme'
import Switcher from '@components/nav/switcher'
import TransitionLinkComponent from '@components/transitions/TransitionLink'

const NavContainerPoses = posed.ul({
  hidden: {
    y: '-100%',
    delay: ({ children }) => children.length * 35 + 75,
    transition: {
      type: 'tween',
      duration: 120,
      ease: 'circIn',
    },
    staggerChildren: 15,
    staggerDirection: -1,
  },
  visible: {
    y: '0%',
    transition: {
      type: 'tween',
      duration: 450,
      ease: 'circOut',
    },
    delayChildren: 350,
    staggerChildren: 50,
  },
})
const NavItemPoses = posed.li({
  hidden: {
    x: 40,
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 175,
      ease: 'easeIn',
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      x: {
        from: -40,
        duration: 250,
        ease: 'easeOut',
      },
      opacity: {
        duration: 150,
        ease: 'linear',
      },
    },
  },
})

const NavWrapper = styled.nav`
  color: ${props => (props.inverted ? props.theme.colors.white : props.theme.colors.black)};

  a {
    color: ${props => (props.inverted ? props.theme.colors.white : props.theme.colors.gray)};
    display: inline-block;
    transition: color 0.75s;

    &:hover {
      color: ${props => (props.inverted ? props.theme.colors.gray : props.theme.colors.black)};
      text-decoration: none;
    }

    &.--active {
      color: ${props => (props.inverted ? props.theme.colors.white : props.theme.colors.black)};
    }
  }
`
const NavBurger = styled.button`
  position: relative;
  width: 30px;
  height: 30px;
  z-index: 20;
  border: 0;
  background: none;
  color: ${props => (props.inverted ? props.theme.colors.white : props.theme.colors.black)};
  transform-origin: center center;
  transform: rotate(0deg);
  transition: transform 250ms cubic-bezier(0.645, 0.045, 0.355, 1); /* ease-in-out-cubic */

  &:focus {
    transform: rotate(90deg);
    outline: none;
  }

  &.expanded {
    transition: none;
  }

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    display: none;
  }
`
const NavBurgerDot = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 100%;
  background: currentColor;
  transition: transform 350ms cubic-bezier(0.645, 0.045, 0.355, 1); /* ease-in-out-cubic */

  &:nth-child(1),
  &:nth-child(2) {
    transform: translate(-12px, 0);
  }
  &:nth-child(3),
  &:nth-child(4) {
    transform: translate(12px, 0);
  }

  ${NavBurger}.expanded & {
    transition: transform 450ms cubic-bezier(0.175, 0.885, 0.32, 1.6); /* ease-out-back */

    &:nth-child(1) {
      transform: translate(-9px, -9px);
    }
    &:nth-child(2) {
      transform: translate(-9px, 9px);
    }
    &:nth-child(3) {
      transform: translate(9px, -9px);
    }
    &:nth-child(4) {
      transform: translate(9px, 9px);
    }
  }
`

const NavContainer = styled(NavContainerPoses)`
  background: ${props => (props.inverted ? props.theme.colors.black : props.theme.colors.white)};
  margin: 0;
  padding: 36vw 24px 0 24px;
  list-style: none;
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  pointer-events: ${props => (props.visible ? 'all' : 'none')};

  @media (min-width: ${props => props.theme.breakpoints[0]}) {
    padding-top: 25vw;
    padding-left: ${props => props.theme.space[4]}px;
    padding-right: ${props => props.theme.space[4]}px;
  }

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    padding-top: 25vw;
    padding-left: 5vw;
    padding-right: 5vw;
  }

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
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
  padding: 4vw 0;
  margin: 0;
  flex: 0 0 auto;

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
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

const fontSizes = ['4.1544927536vh', null, null, 3]

const Nav = ({ inverted, intl, pathname = null }) => {
  const [ visible, setVisible ] = useState(false)
  const { locale } = intl

  useEffect(() => {
    setVisible(false)
  }, [pathname])

  return (
    <NavWrapper inverted={inverted}>
      <NavBurger
        className={visible ? 'expanded' : null}
        onClick={event => setVisible(!visible)}
        aria-label="Menu"
        inverted={inverted}
      >
        <NavBurgerDot />
        <NavBurgerDot />
        <NavBurgerDot />
        <NavBurgerDot />
        <NavBurgerDot />
      </NavBurger>

      <NavContainer
        initialPose={'hidden'}
        pose={visible ? 'visible' : 'hidden'}
        visible={visible}
        inverted={inverted}
        withParent={false}
      >
        <NavItem>
          <TransitionLinkComponent to={`/projects/`} color={colors.blue}>
            <Text fontSize={fontSizes}>
              <FormattedMessage id="nav.Projects" />
            </Text>
          </TransitionLinkComponent>
        </NavItem>

        <NavItem>
          <TransitionLinkComponent to={`/about/`} color={colors.black}>
            <Text fontSize={fontSizes}>
              <FormattedMessage id="nav.About" />
            </Text>
          </TransitionLinkComponent>
        </NavItem>

        {/* add journal link in `fr` only */}
        {locale === `fr` &&
          <NavItem>
            <TransitionLinkComponent to={`/journal/`} color={colors.lightGray}>
              <Text fontSize={fontSizes}>
                <FormattedMessage id="nav.Journal" />
              </Text>
            </TransitionLinkComponent>
          </NavItem>
        }

        {/* <NavItem>
          <TransitionLinkComponent to={`/formation/`} color={colors.lightGray}>
            <Text fontSize={fontSizes}>
              <FormattedMessage id="nav.Formation" />
            </Text>
          </TransitionLinkComponent>
        </NavItem> */}

        {/* <NavItem>
          <TransitionLinkComponent to={`/open-source/`} color={colors.black}>
            <Text fontSize={fontSizes}>
              <FormattedMessage id="nav.OpenSource" />
            </Text>
          </TransitionLinkComponent>
        </NavItem> */}

        <NavItem>
          <TransitionLinkComponent to={`/contact/`} color={colors.black}>
            <Text fontSize={fontSizes}>
              <FormattedMessage id="nav.Contact" />
            </Text>
          </TransitionLinkComponent>
        </NavItem>

        <NavItem>
          <Switcher fontSizes={fontSizes} />
        </NavItem>
      </NavContainer>
    </NavWrapper>
  )
}

export default injectIntl(Nav)
