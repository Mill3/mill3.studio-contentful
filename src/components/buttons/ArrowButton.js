import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Box } from 'rebass'

const pointerOver = keyframes`
  to {
    transform: translateX(5px) scaleX(0);
  }
`
const pointerOut = keyframes`
  from {
    transform: translateX(0px) scaleX(1);
  }
  to {
    transform: translateX(-4px) scaleX(1);
  }
`


const UnderlineStyle = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  overflow: hidden;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: currentColor;
  }

  &:before {
    transform-origin: top right;
    transform: translateX(-4px) scaleX(1);
    animation-name: ${pointerOut};
    animation-duration: 250ms;
    animation-fill-mode: backwards;
    animation-timing-function: ease-out;
  }
  &:after {
    transform-origin: top left;
    transform: scaleX(0);
  }
`
export const ArrowButtonStyle = styled.span`
  position: relative;
  display: inline-block;
  line-height: 1.2;
  font-family: ${props => props.theme.fonts.sans};
  font-weight: 400;
  padding: 0 4px 7px 0;

  &:after {
    content: '→';
    display: inline-block;
    padding-left: 0.25em;
    font-size: 80%;
    transform: translateX(0px);
    transition: transform 250ms ease-out;
  }

  &:hover,
  &:focus,
  &:active {
    &:after {
      transform: translateX(4px);
    }

    ${UnderlineStyle} {
      &:before {
        animation-name: ${pointerOver};
        animation-duration: 850ms;
        animation-fill-mode: forwards;
        animation-timing-function: cubic-bezier(0.190, 1.000, 0.220, 1.000); /* easeOutExpo */
      }
      &:after {
        transform: scaleX(1);
        transition: transform 850ms 250ms cubic-bezier(0.190, 1.000, 0.220, 1.000); /* easeOutExpo */
      }
    }
  }
`

const ArrowButton = ({color, children}) => {
  return (
    <Box as={ArrowButtonStyle} color={color || "#000"} fontSize={[2,2,3]}>
      <Box as={UnderlineStyle} aria-hidden="true"></Box>
      {children}
    </Box>
  );
}

export default ArrowButton
