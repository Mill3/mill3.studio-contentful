import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import { VERTICAL_SPACER } from './index'

const Bold = ({ children }) => <strong>{children}</strong>
const Text = ({ children }) => <p>{children}</p>
const Blockquote = ({ children }) => <blockquote>{children}</blockquote>

const parseAsset = node => {
  return <span>id: {node.data.target.sys.id}</span>
}

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.QUOTE]: (node, children) => <Blockquote>{children}</Blockquote>,
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => (
      <figure>{parseAsset(node)}</figure>
    ),
  },
}

export const format = json => {
  let parsedJSON = JSON.parse(json)
  return documentToReactComponents(parsedJSON, options)
}

const postBody = styled.div`
  /* TODO: overides all default styles for HTML elements available in Contentful richtext editor (blockquotes, b, strong, italic, p, heading, etc) */

  h2, h3, h4, h5 {
    font-weight: 500;
    margin-bottom: 2rem;
  }

  p {
    margin-bottom: 2rem;
  }

`

const ContentText = ({ data }) => {
  return (
    <Box as={postBody} mb={VERTICAL_SPACER} px={[0, 5, 5, 5, '15vw']}>
      {format(data.text.text)}
    </Box>
  )
}

export default ContentText

export const ContentTextFragement = graphql`
  fragment ContentTextFragement on ContentfulContentText {
    id
    title
    text {
      text
    }
  }
`
