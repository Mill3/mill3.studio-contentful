import React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'

const ContainerBox = styled.div`
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    max-width: ${props => props.fluid ? '90vw' : '1024px'};
  }
`

const Container = (props) => {
  return (
    <Box
      {...props}
      as={ContainerBox}
      px={[`24px`, 4, 0]}
      mx='auto'
    />
  )
}

Container.defaultProps = {
  fluid: true
}

export default Container;
