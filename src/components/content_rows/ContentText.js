import React from 'react'
import { is } from 'ramda'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import posed from 'react-pose'
import { Box } from 'rebass'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { useInView } from 'react-intersection-observer'

import { EASES, REVEALS_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'
import TransitionContainer from '@components/transitions/TransitionContainer'
import {
  AnimatedBackgroundRowContainer,
  RowContainer,
  Grid,
  VERTICAL_SPACER,
  BOTTOM_SPACER,
  GRID_GUTTER,
} from './index'
import EmbeddedAsset from './EmbeddedAsset'

const Bold = ({ children }) => <strong>{children}</strong>
const Text = ({ children }) => <p>{children}</p>
const Blockquote = ({ children }) => (
  <Box as={`blockquote`} mx={[0, 0, 0, 0, '-5vw']} mb={[2, 2, 2]} className="is-serif is-center">
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

export const postBody = styled.div`
  /* TODO: overides all default styles for HTML elements available in Contentful richtext editor (blockquotes, b, strong, italic, p, heading, etc) */

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: 500;
    margin-bottom: 2rem;
    color: ${props => (props.textColor ? props.textColor : `inherit`)};
    line-height: 1.35;
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

  h3 {
    font-size: ${props => props.theme.fontSizes[4]}px;
    font-weight: 300;
    @media (min-width: ${props => props.theme.breakpoints[4]}) {
      font-size: 2.15555556vw;
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

export const TextColumn = ({ text, textColor, index, margin, isFirst }) => {
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <Box as={postBody} textColor={textColor ? textColor : false} my={margin || VERTICAL_SPACER}>
      <TransitionContainer enabled={inView} autoCalculateDelay={isFirst || false } distance={85} index={index}>
        <Box
          ref={ref}
          as={`div`}
          index={index}
        >
          {text}
        </Box>
      </TransitionContainer>
    </Box>
  )
}

const ContentText = ({ data, isFirst, isLast }) => {
  const Wrapper = data.fadeInBackgroundColor ? AnimatedBackgroundRowContainer : RowContainer

  const CalculatePaddingTop = () => {
    return data.noVerticalMargin ? [0] : isFirst ? [0] : VERTICAL_SPACER
  }

  const CalculatePaddingBottom = () => {
    return data.noVerticalMargin ? [0] : isFirst || isLast ? BOTTOM_SPACER : VERTICAL_SPACER
  }

  return (
    <Wrapper backgroundColor={data.backgroundColor || null}>
      {data.text && (
        <Box pt={CalculatePaddingTop()} pb={CalculatePaddingBottom()}>
          <Box mx="auto" px={[4, 5, `15vw`, `20vw`, `30vw`]}>
            <TextColumn
              index={1}
              text={data.text ? format(data.text.text || data.text.content) : []}
              textColor={data.textColor ? data.textColor : false}
              margin={[0]}
              isFirst={isFirst}
            />
          </Box>
        </Box>
      )}
      {data.textColumns && (
        <Box
          pt={CalculatePaddingTop()}
          pb={CalculatePaddingBottom()}
          px={[4, 5, 5, 5, 5, data.itemsPerRow === '3' ? `${GRID_GUTTER * 3}px` : `15vw`]}
        >
          <Grid gridGutter={100} itemsPerRow={data.itemsPerRow}>
            {data.textColumns &&
              data.textColumns.map((textColumn, index) => (
                <TextColumn
                  key={index}
                  text={textColumn.text ? format(textColumn.text.text || textColumn.text.content) : []}
                  textColor={data.textColor ? data.textColor : false}
                  margin={[0]}
                  index={index}
                />
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
    noVerticalMargin
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
