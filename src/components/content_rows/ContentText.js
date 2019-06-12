import React from 'react'
import { is } from 'ramda'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Box } from 'rebass'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import { RowContainer, Grid, ALIGN_VALUES, VERTICAL_SPACER } from './index'

import EmbeddedAsset from './EmbeddedAsset'

const Bold = ({ children }) => <strong>{children}</strong>
const Text = ({ children }) => <p>{children}</p>
const Blockquote = ({ children }) => (
  <Box
    as={`blockquote`}
    mx={[0, 0, '-5vw']}
    mb={[2, 2, 2]}
    // color="blue"
    className="is-serif is-center"
  >
    {children}
  </Box>
)

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.QUOTE]: (node, children) => <Blockquote>{children}</Blockquote>,
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => (
      <>
        <EmbeddedAsset id={node.data.target.sys.id} />
      </>
    ),
  },
}

export const format = json => {
  let parsedJSON = is(String, json) ? JSON.parse(json) : { content: json }
  return documentToReactComponents(parsedJSON, options)
}

const postBody = styled.div`
  /* TODO: overides all default styles for HTML elements available in Contentful richtext editor (blockquotes, b, strong, italic, p, heading, etc) */
  /* max-width: ${props => (props.maxWidth ? props.maxWidth : 'inherit')}; */

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: 500;
    margin-bottom: 2rem;
    color: ${props => (props.textColor ? props.textColor : `inherit`)};
  }

  p {
    margin-bottom: 2rem;
    color: ${props => (props.textColor ? props.textColor : `inherit`)};
  }

  a {
    color: ${props => (props.textColor ? props.textColor : `inherit`)};
  }

  /* paragraph following a blockquote  */
  blockquote + p {
    text-align: center;
  }

`

const ContentText = ({ data }) => {
  return (
    <RowContainer
      // alignContent={ALIGN_VALUES['center']}
      backgroundColor={data.backgroundColor}
    >
      {data.text && (
        <Box
          pt={data.backgroundColor ? VERTICAL_SPACER : 0}
          pb={data.backgroundColor ? `1px` : 0}
        >
          <Box
            as={postBody}
            textColor={data.textColor ? data.textColor : false}
            mb={VERTICAL_SPACER}
            mx="auto"
            px={[4, 5, 5, 5, 5, `30vw`]}
          >
            {data.text ? format(data.text.text) : []}
          </Box>
        </Box>
      )}
      {data.textColumns && (
        <Box
          pt={data.backgroundColor ? VERTICAL_SPACER : 0}
          px={[4, 5, 5, 5, 5, `15vw`]}
        >
          <Grid gridGutter={100} itemsPerRow={data.itemsPerRow}>
            {data.textColumns &&
              data.textColumns.map((textColumn, index) => (
                <Box
                  as={postBody}
                  textColor={data.textColor ? data.textColor : false}
                  mb={VERTICAL_SPACER}
                >
                  {textColumn.text
                    ? format(textColumn.text.text || textColumn.text.content)
                    : []}
                </Box>
              ))}
          </Grid>
        </Box>
      )}
    </RowContainer>
  )
}

export default ContentText

export const ContentTextFragement = graphql`
  fragment ContentTextFragement on ContentfulContentText {
    id
    title
    textColor
    backgroundColor
    itemsPerRow
    text {
      text
    }
    textColumns {
      text {
        id
        text
        json
      }
    }
  }
`
