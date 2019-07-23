import React from 'react'
import { is } from 'ramda'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Box, Text } from 'rebass'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import { postBody, format } from './ContentText'

import { RowContainer, Grid, VERTICAL_SPACER, GRID_GUTTER } from './index'

const fontSizes = [5, 4, 5, '3.611111111vw'];
const subtitleFontSizes = [3, 3, 3, '1.805555556vw'];

const ContentSectionBreak = ({ data }) => {
  console.log('data:', data)

  return (
    <RowContainer>
      <Box as="header" className="is-center" mb={[6, 6, 5, 6]} px={[4,3,0]}>
        {data.title && (
          <Text as={`h1`} fontSize={fontSizes} className="is-serif fw-900" mb={[5, 5, 4, 5]}>{data.title}</Text>
        )}
        {data.text && (
          <Box
            as={postBody}
            mb={VERTICAL_SPACER}
            mx="auto"
            width={[1, 1, '90%', '60vw']}
          >
            <Text textAlign={`center`}>
              {data.text ? format(data.text.text) : []}
            </Text>
          </Box>
        )}
      </Box>
    </RowContainer>
  )
}

export default ContentSectionBreak

export const ContentSectionBreakFragement = graphql`
  fragment ContentSectionBreakFragement on ContentfulContentSectionBreak {
    id
    title
    text {
      text
    }
  }
`
