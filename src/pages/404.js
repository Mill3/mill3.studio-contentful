import React from 'react'
import styled from 'styled-components'
import { Box, Text, Img } from 'rebass'

import Container from '@styles/Container'

import john from '@images/john.gif'

const NotFoundContainer = styled.div`

  h1 {
    font-size: 8vw;
  }

`

const NotFoundPage = () => (
  <Container>
    <Box as={NotFoundContainer} py={[`10vh`]} pr={[0,0,0,'40vw']}>
      <Text as={`h1`} fontSize={['4vw', '8vw']}>404</Text>
      <img src={john} alt="Stay confused John.." className="img-fluid" />
      {/* <p>You just hit a route that doesn&#39;t exist... the sadness.</p> */}
    </Box>
  </Container>
)

export default NotFoundPage
