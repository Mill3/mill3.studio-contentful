import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { injectIntl } from 'gatsby-plugin-intl'

export const FONT_SIZES = {
  en: ['9.2vw', null, '10.416666667vw', null, '10.833333333vw'], // 38px, null, 80px, null, 156px
  fr: ['7.246376812vw', null, '7.552083333vw', null, '7.777777778vw'], // 30px, null, 58px, null, 112px
}

const HomeTitleStyle = styled.h2`
  text-transform: uppercase;
  transform-origin: top center;
`

const HomeTitle = ({ intl, children, ...props }) => (
  <Text
    as={HomeTitleStyle}
    fontFamily={'serif'}
    fontSize={FONT_SIZES[intl.locale]}
    fontWeight={'300'}
    m={0}
    p={0}
    {...props}
  >{children}</Text>
)

export default React.memo(injectIntl(HomeTitle))
