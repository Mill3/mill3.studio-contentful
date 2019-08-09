import React from 'react'

// import all images
import CircleWorkEn from '@images/circle-work-en.png'
import CircleWorkFr from '@images/circle-work-fr.png'
import CircleContactEn from '@images/circle-contact-en.png'
import CircleContactFr from '@images/circle-contact-fr.png'

import Circle from '@svg/Circle'
import CircularIcon from '@utils/CircularIcon'

const AssetsByLocale = {
  'en': {
    'work' : CircleWorkEn,
    'contact': CircleContactEn
  },
  'fr': {
    'work' : CircleWorkFr,
    'contact': CircleContactFr
  }
}

const HeaderCircle = (props) => (
  <CircularIcon css={{bottom: 0, transform: 'translateY(50%)', backgroundBlendMode: 'lighten'}} {...props}>
    <img src={AssetsByLocale[props.locale][props.type]} alt="rotating circle"/>
  </CircularIcon>
)


HeaderCircle.defaultProps = {
  locale: `en`,
  type: `work`,
}


export default HeaderCircle
