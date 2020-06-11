import React from 'react'
import styled from 'styled-components'

import Theme from '@styles/Theme'

const RootPagePane = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  background: ${() => Theme.colors.black};
`

const RootPage = () => (
  <RootPagePane></RootPagePane>
)

export default RootPage
