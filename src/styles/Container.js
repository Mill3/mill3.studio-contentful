import React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'

import { HORIZONTAL_SPACER } from '@components/content_rows'

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
      px={[3, 4, 0]}
      mx='auto'
    />
  )
}

Container.defaultProps = {
  fluid: true
}

export default Container;
