import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

export const LinkButtonStyle = styled.span`
  display: inline-block;
  font-family: ${props => props.theme.fonts.serif};
  text-align: center;
  position: relative;
  transition: color 0.5s;

  span {
    transition: background-size 0.5s ease-in-out;
    background-image: linear-gradient(transparent calc(100% - 3px), ${props => props.hoverColor ? props.hoverColor : `#000`}  3px);
    background-repeat: no-repeat;
    background-size: ${props => props.hover ? `100% 100%` : `0% 100%` };
  }


  &:hover {
    text-decoration: none;
    color: ${props => props.hoverColor ? props.hoverColor : `#000`};
    span {
      background-size: 100% 100%;
    }
  }
`

const LinkButton = ({children, hoverColor, fontSize = [6], fontWeight = 300, color = "#000", ...props}) => {
  return (
    <Text as={LinkButtonStyle} fontSize={fontSize} fontWeight={fontWeight} lineHeight={1.15} color={color} hoverColor={hoverColor} {...props}>
      {children}
    </Text>
  );
}

export default LinkButton
