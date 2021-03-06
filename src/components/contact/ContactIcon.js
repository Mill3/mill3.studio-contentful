import React from 'react'

import Form from '@svg/Form'
import CircularIcon from '@utils/CircularIcon'

const ContactIcon = (props) => (
  <CircularIcon css={{top: 0, transform: 'translateY(-50%)'}} {...props} locale={props.locale} type={`contact`}>
    <Form />
  </CircularIcon>
)

export default ContactIcon
