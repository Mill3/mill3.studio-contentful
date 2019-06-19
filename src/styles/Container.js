import React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'

const ContainerBox = styled.div`
  max-width: ${props => props.fluid ? '90vw' : '1024px'};
`

const Container = (props) => {
  return (
    <Box
      {...props}
      as={ContainerBox}
      mx='auto'
    />
  )
}

Container.defaultProps = {
  fluid: true
}

export default Container;
