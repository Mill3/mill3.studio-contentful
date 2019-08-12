import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { Box, Text } from 'rebass'

import Logo from '@svg/Logo'
import Container from '@styles/Container'

import { detectLocale } from '@utils/Locales'

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
      <Link to={`/${detectLocale()}/`}>
        <img src={john} alt="Stay confused John.." className="img-fluid" />
      </Link>
    </Box>
  </Container>
)

export default NotFoundPage
