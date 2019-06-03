import React from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'

export const ButtonStyle = styled.span`
  display: inline-block;
  line-height: 1;
  background-color: ${props => props.theme.colors.purple};
  color: #fff;
  border-radius: 40px;
  overflow: hidden;
  height: 60px;
  transition: all 0.25s ease-in-out;
  font-weight: 300;
  span {
    display: block;
    padding: 20px 45px;
    transition: transform 0.25s;
  }
  &:hover {
    background-color: ${props => props.theme.colors.black};
    transform: rotate3d(1,1,1,-2.74deg);
    span {
      transform: translateY(-100%);
    }
  }
`

const Button = ({children}) => {
  return (
    <Box as={ButtonStyle} fontSize={[2,2,3]}>
      <span>{children}</span>
      <span>{children}</span>
    </Box>
  );
}

export default Button
