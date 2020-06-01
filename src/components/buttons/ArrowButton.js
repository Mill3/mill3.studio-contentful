import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Box } from 'rebass'

const underlineOver = keyframes`
  to {
    transform: translateX(1px) scaleX(0);
  }
`
const arrowAppear = keyframes`
  from {
    opacity: 0;
    transform: translate(-75%, -50%);
  }
  to {
    opacity: 1;
    transform: translate(0%, -50%);
  }
`
const arrowDisappear = keyframes`
  from {
    opacity: 1;
    transform: translate(0%, -50%);
  }
  to {
    opacity: 0;
    transform: translate(75%, -50%);
  }
`
const arrowMixin = css`
  &:before,
  &:after {
    content: '→';
    position: absolute;
    top: 50%;
    right: -1px;
    display: block;
    font-size: 80%;
    margin-top: -2px;
    transform: translate(0%, -50%);
    will-change: transform, opacity;
  }

  &:before {
    animation-name: ${arrowAppear};
    animation-duration: 250ms;
    animation-delay: 200ms;
    animation-fill-mode: both;
    animation-timing-function: ease-out;
  }
  &:after {
    animation-name: ${arrowDisappear};
    animation-duration: 250ms;
    animation-delay: 0ms;
    animation-fill-mode: both;
    animation-timing-function: linear;
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
  padding: 0 ${({ arrow }) => arrow ? '1em' : 0} 7px 0;

  ${({ arrow }) => (arrow ? arrowMixin : null)};

  &:hover,
  &:focus,
  &:active {
    &:before {
      animation-name: ${arrowDisappear};
      animation-duration: 250ms;
      animation-delay: 0ms;
      animation-fill-mode: both;
      animation-timing-function: linear;
    }
    &:after {
      animation-name: ${arrowAppear};
      animation-duration: 250ms;
      animation-delay: 200ms;
      animation-fill-mode: both;
      animation-timing-function: ease-out;
    }

    ${UnderlineStyle} {
      &:before {
        animation-name: ${underlineOver};
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

const ArrowButton = ({arrow = true, color = "#000", children}) => {
  return (
    <Box as={ArrowButtonStyle} arrow={arrow} color={color} fontSize={[2,2,3]}>
      <Box as={UnderlineStyle} aria-hidden="true"></Box>
      {children}
    </Box>
  );
}

export default ArrowButton
