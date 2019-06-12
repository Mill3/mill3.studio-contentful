import React from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'

export const LinkButtonStyle = styled.span`
  display: inline-block;
  line-height: 1;
  font-family: ${props => props.theme.fonts.serif};
  color: #000;
  text-align: center;
  transition: all 0.25s ease-in-out;
  font-weight: 300;
  position: relative;
  span {
    position: relative;
    z-index: 2;
    mix-blend-mode: multiply;
  }
  &:after {
    content: "";
    display: block;
    transition: all 0.25s ease-in-out;
    height: 3px;
    width: 0;
    background-color: ${props => props.hoverColor ? props.hoverColor : `#000`};
    position: absolute;
    bottom: -8px;
    left: -10px;
    z-index: 1;
  }
  &:hover {
    text-decoration: none;
    /* color: ${props => props.hoverColor ? props.hoverColor : `#000`}; */
    &:after {
      width: calc(100% + 20px);
      /* height: calc(10px); */
      /* background-color: ${props => props.hoverColor ? props.hoverColor : `#000`}; */
    }
  }
`

const LinkButton = ({children, hoverColor}) => {
  return (
    <Box as={LinkButtonStyle} fontSize={[6]} hoverColor={hoverColor}>
      <span>{children}</span>{}
    </Box>
  );
}

export default LinkButton
