import React from 'react'
import { is } from 'ramda'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Box } from 'rebass'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import { AnimatedBackgroundRowContainer, RowContainer, Grid, VERTICAL_SPACER, GRID_GUTTER } from './index'

import EmbeddedAsset from './EmbeddedAsset'

const Bold = ({ children }) => <strong>{children}</strong>
const Text = ({ children }) => <p>{children}</p>
const Blockquote = ({ children }) => (
  <Box
    as={`blockquote`}
    mx={[0, 0, 0, 0, '-5vw']}
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

  /* special style for H2 */
  h2 {
    font-size: 6.763285024vw;
    text-align: center;
    line-height: 1.1;
    margin-top: 4rem;

    @media (min-width: ${props => props.theme.breakpoints[2]}) {
      font-size: ${props => props.theme.fontSizes[6]}px;
    }
    @media (min-width: ${props => props.theme.breakpoints[4]}) {
      margin-left: -5vw;
      margin-right: -5vw;
    }
  }

  /* special style for H4 */
  h4 {
    font-size: 24px;
  }

  p {
    font-size: 18px;
    margin-bottom: 2rem;
    color: ${props => (props.textColor ? props.textColor : `inherit`)};
  }

  a {
    color: ${props => (props.textColor ? props.textColor : `inherit`)};
  }

  /* blockquote */
  blockquote {
    p {
      font-size: 6.763285024vw;
      font-style: italic;

      @media (min-width: ${props => props.theme.breakpoints[1]}) {
        font-size: 1.85vw;
      }
    }
  }

  /* paragraph following a blockquote  */
  blockquote + p {
    text-align: center;
  }

`

const ContentText = ({ data }) => {
  const Wrapper = data.fadeInBackgroundColor ? AnimatedBackgroundRowContainer : RowContainer

  return (
    <Wrapper backgroundColor={data.backgroundColor}>
      {data.text && (
        <Box pt={data.backgroundColor ? VERTICAL_SPACER : 0} pb={data.backgroundColor ? `1px` : 0}>
          <Box
            as={postBody}
            textColor={data.textColor ? data.textColor : false}
            mb={VERTICAL_SPACER}
            mx="auto"
            px={[4, 5, `15vw`, `20vw`, `30vw`]}
          >
            {data.text ? format(data.text.text) : []}
          </Box>
        </Box>
      )}
      {data.textColumns && (
        <Box pt={data.backgroundColor ? VERTICAL_SPACER : 0} px={[4, 5, 5, 5, 5, data.itemsPerRow === '3' ? `${GRID_GUTTER * 3}px` : `15vw`]}>
          <Grid gridGutter={100} itemsPerRow={data.itemsPerRow}>
            {data.textColumns &&
              data.textColumns.map((textColumn, index) => (
                <Box as={postBody} textColor={data.textColor ? data.textColor : false} mb={VERTICAL_SPACER} key={index}>
                  {textColumn.text ? format(textColumn.text.text || textColumn.text.content) : []}
                </Box>
              ))}
          </Grid>
        </Box>
      )}
    </Wrapper>
  )
}

export default ContentText

export const ContentTextFragement = graphql`
  fragment ContentTextFragement on ContentfulContentText {
    id
    title
    textColor
    backgroundColor
    fadeInBackgroundColor
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
