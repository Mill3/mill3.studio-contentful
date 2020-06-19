import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { is } from 'ramda'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Box } from 'rebass'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { useInView } from 'react-intersection-observer'

import { LayoutContext } from '@layouts/layoutContext'

import TransitionContainer from '@components/transitions/TransitionContainer'
import {
  AnimatedBackgroundRowContainer,
  RowContainer,
  Grid,
  VERTICAL_SPACER,
  BOTTOM_SPACER,
} from './index'
import EmbeddedAsset from './EmbeddedAsset'

const Bold = ({ children }) => <strong>{children}</strong>
const Text = ({ children }) => <p>{children}</p>
const Blockquote = ({ children }) => (
  <Box
    as={`blockquote`}
    mx={[0, 0, '-5vw', '-5vw', '-5vw']}
    mb={[2, 2, 2]}
    className="is-serif is-center"
  >
    {children}
  </Box>
)

class HyperLink extends Component {

  static contextType = LayoutContext

  constructor(props) {
    super(props);
    this.scrollTo = this.scrollTo.bind(this);
    this.scrollbar = null;
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true
  }

  componentDidUpdate() {
    if(this.scrollbar) return
    if(this.context.layoutState.scrollbar) {
      this.scrollbar = this.context.layoutState.scrollbar
    }
  }

  scrollTo(e, element) {
    e.preventDefault()
    if (this.scrollbar && element) this.scrollbar.scrollIntoView(element, { alignToTop: true })
  }

  render() {
    const { node, children } = this.props
    const hasHash = node.data.uri.search('#') >= 0
    const element = (hasHash && typeof window !== `undefined`) ? document.querySelector(node.data.uri) : null
    let props = {}

    if (element) {
      props.href = "#"
      props.onClick = (e) => this.scrollTo(e, element)
    } else {
      props.href = node.data.uri
      props.target = "_blank"
    }

    return (<a {...props}>{ children }</a>);
  }
}

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => <HyperLink node={node} children={children} />,
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
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: ${props => (props.textColor ? props.textColor : `inherit`)};
    line-height: 1.35;
  }

  /* special style for H2 */
  h2 {
    font-size: 6.763285024vw;
    line-height: 1.1;
    margin-top: 4rem;

    @media (min-width: ${props => props.theme.breakpoints[2]}) {
      font-size: ${props => props.theme.fontSizes[6]}px;
    }
  }

  h3 {
    font-size: 5.75vw;
    font-weight: 300;
    @media (min-width: ${props => props.theme.breakpoints[1]}) {
      font-size: 3.8vw;
    }
    @media (min-width: ${props => props.theme.breakpoints[2]}) {
      font-size: 2.8vw;
    }
    @media (min-width: ${props => props.theme.breakpoints[3]}) {
      font-size: 1.805vw;
    }
  }

  /* special style for H4 */
  h4 {
    font-size: 24px;
  }

  p {
    font-size: 18px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: ${props => (props.textColor ? props.textColor : `inherit`)};
  }

  p + h2,
  p + h3,
  p + h4,
  p + h5 {
    margin-top: 2rem;
  }

  a {
    color: ${props => (props.textColor ? props.textColor : props.theme.colors.blue)};
  }



  /* blockquote */
  blockquote {
    p {
      font-size: 6.763285024vw;
      font-style: italic;
      text-align: center;

      @media (min-width: ${props => props.theme.breakpoints[1]}) {
        font-size: 1.85vw;
      }
    }
  }

  /* blockquote following a paragraph */
  p + blockquote {
    margin-top: 5rem;
  }

  /* paragraph following a blockquote  */
  blockquote + p {
    text-align: center;
    margin-bottom: 5rem;
  }

  ul {
    @media (max-width: ${props => props.theme.breakpoints[1]}) {
        font-size: 18px;
        padding-left: 22px;
      }
  }

`

const postBodySerif = styled(postBody)`

  p {
    font-family: ${props => props.theme.fonts.serifText};
    font-size: 19px;
    font-weight: normal;
    line-height: 31px;
  }

  strong, b {
    font-weight: bold;
  }

`

export const TextColumn = ({ text, textColor, textStyle, index, margin, isFirst }) => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const boxStyling = textStyle === 'Serif' ? postBodySerif : postBody;

  return (
    <Box
      as={boxStyling}
      textColor={textColor ? textColor : false}
      my={margin || VERTICAL_SPACER}
    >
      <TransitionContainer
        enabled={inView}
        autoCalculateDelay={isFirst || false}
        distance={85}
        index={index}
      >
        <Box ref={ref} as={`div`} index={index}>
          {text}
        </Box>
      </TransitionContainer>
    </Box>
  )
}

export const CalculatePaddingTop = (noVerticalMargin, isFirst, backgroundColor) => {

  if (isFirst && !backgroundColor) {
    return [0]
  }

  if (noVerticalMargin) {
    return [0]
  }

  if (backgroundColor) {
    return VERTICAL_SPACER
  }

  return VERTICAL_SPACER

}

export const CalculatePaddingBottom = (
  noVerticalMargin,
  isFirst,
  isLast,
  backgroundColor
) => {
  return backgroundColor
    ? VERTICAL_SPACER
    : noVerticalMargin
    ? [0]
    : isFirst || isLast
    ? BOTTOM_SPACER
    : VERTICAL_SPACER
}

export const TEXT_COLUMN_PADDING = [0, 0, `15vw`, `15vw`, `18vw`, `21vw`]

const ContentText = ({ data, isFirst, isLast }) => {
  const {
    text,
    textColor,
    textColumns,
    itemsPerRow,
    noVerticalMargin,
    fadeInBackgroundColor,
    backgroundColor,
    textStyle,
  } = data
  const Wrapper = fadeInBackgroundColor ? AnimatedBackgroundRowContainer : RowContainer

  return (
    <Wrapper backgroundColor={backgroundColor || null}>
      {text && (
        <Box
          pt={CalculatePaddingTop(noVerticalMargin, isFirst)}
          pb={
            textColumns ? [0] : CalculatePaddingBottom(noVerticalMargin, isFirst, isLast)
          }
        >
          <Box mx="auto" px={TEXT_COLUMN_PADDING}>
            <TextColumn
              index={1}
              text={text ? format(text.text || text.content) : []}
              textColor={textColor ? textColor : false}
              textStyle={textStyle ? textStyle : false}
              margin={[0]}
              isFirst={isFirst}
            />
          </Box>
        </Box>
      )}
      {textColumns && (
        <Box
          pt={CalculatePaddingTop(noVerticalMargin, isFirst)}
          pb={CalculatePaddingBottom(noVerticalMargin, isFirst, isLast)}
          px={
            parseInt(data.itemsPerRow) <= 2
              ? [0, 0, 0, 0, `5.45vw`, `6.4vw`]
              : [0, 0, 0, 0, `5vw`, `12vw`]
          }
        >
          <Grid gridGutter={100} itemsPerRow={itemsPerRow}>
            {textColumns &&
              textColumns.map((textColumn, index) => (
                <TextColumn
                  key={index}
                  text={
                    textColumn.text
                      ? format(textColumn.text.text || textColumn.text.content)
                      : []
                  }
                  textColor={textColor ? textColor : false}
                  textStyle={textStyle ? textStyle : false}
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
    textStyle
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
