import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rebass'

export const ChipButtonStyle = styled.button`
  position: relative;
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  padding: 0 20px;
  width: 90px;
  height: 90px;
  color: #B47C6D;
  cursor: pointer;

  .chipbutton__bg {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    background-color: ${props => props.theme.colors.purple};
    border-radius: 100%;
    transition: transform 0.25s ease-in-out;
  }

  &:hover .chipbutton__bg {
    background-color: ${props => props.theme.colors.black};
    transform: scale(1.1);
  }
`

const ChipButton = (props) => {
  return (
    <Flex as={ChipButtonStyle} fontSize={[2]} alignItems="center" justifyContent="center" {...props}>
      <span className="chipbutton__bg" aria-hidden="true"></span>
      {props.children}
    </Flex>
  );
}

export default ChipButton
