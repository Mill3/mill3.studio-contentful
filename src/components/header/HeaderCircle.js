import React from 'react'

import Circle from '@svg/Circle'
import CircularIcon from '@utils/CircularIcon'

const HeaderCircle = (props) => (
  <CircularIcon css={{bottom: 0, transform: 'translateY(50%)', backgroundBlendMode: 'lighten'}} {...props}>
    <Circle />
  </CircularIcon>
)

export default HeaderCircle
