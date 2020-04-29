import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { Box } from 'rebass'

class ContentSpacer extends Component {
  render() {
    const { spacer, backgroundColor } = this.props.data
    return <Box py={`${spacer}rem`} backgroundColor={backgroundColor ? backgroundColor : `transparent`} />
  }
}

export default ContentSpacer

export const ContentSpacerFragement = graphql`
  fragment ContentSpacerFragement on ContentfulContentSpacer {
    id
    spacer
    backgroundColor
  }
`
