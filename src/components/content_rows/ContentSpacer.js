import React from 'react'
import { graphql } from 'gatsby'
import { Box } from 'rebass'

const ContentSpacer = ({ data: {spacer, backgroundColor} }) => {
  return <Box py={`${spacer}rem`} backgroundColor={backgroundColor ? backgroundColor : `transparent`} />
}

export default ContentSpacer

export const ContentSpacerFragement = graphql`
  fragment ContentSpacerFragement on ContentfulContentSpacer {
    id
    spacer
    backgroundColor
  }
`
