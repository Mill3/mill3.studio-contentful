import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Text } from 'rebass'

const HoverAnimation = keyframes`
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
`

export const LinkButtonStyle = styled.span`
  display: inline-block;
  line-height: 1;
  font-family: ${props => props.theme.fonts.serif};
  color: #000;
  text-align: center;
  position: relative;

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    &:after {
      content: "";
      display: block;
      height: 3px;
      background-color: ${props => props.hoverColor ? props.hoverColor : `#000`};
      position: absolute;
      bottom: -8px;
      left: -10px;
      right: -10px;
      z-index: 1;
      transform-origin: top left;
    }
  }

  &:hover {
    text-decoration: none;

    &:after {
      @media (min-width: ${props => props.theme.breakpoints[1]}) {
        animation: ${HoverAnimation} 250ms ease-in-out 100ms both;
      }
    }
  }
`

const LinkButton = ({children, hoverColor, fontSize = [6], fontWeight = 300, ...props}) => {
  return (
    <Text as={LinkButtonStyle} fontSize={fontSize} fontWeight={fontWeight} hoverColor={hoverColor} {...props}>
      {children}
    </Text>
  );
}

export default LinkButton
