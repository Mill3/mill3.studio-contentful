import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'rebass'
import { InView } from 'react-intersection-observer'

import Container from '@styles/Container'
import ContentText from './ContentText'
import ContentImages from './ContentImages'
import ContentVideos from './ContentVideos'
import ContentSlides from './ContentSlides'
import ContentSectionBreak from './ContentSectionBreak'

export const ALIGN_VALUES = {
  'center': 'center',
  'left': 'snap-left',
  'right': 'snap-right'
}

export const VERTICAL_ALIGN_VALUES = {
  'start': 'flex-start',
  'center': 'center',
  'end': 'flex-end'
}

export const CONTENT_ROW_TYPES = {
  'text': 'ContentfulContentText',
  'images': 'ContentfulContentImages',
  'videos': 'ContentfulContentVideos',
  'slides': 'ContentfulContentSlides',
  'section_break': 'ContentfulContentSectionBreak',
}

// responsive value between each row
// this value is used in Rebass margin properties
export const VERTICAL_SPACER = [4,4,5,6]
export const HORIZONTAL_SPACER = [4,5,6]

// gutter between each grid elements
export const GRID_GUTTER = 25

export const RowContainer = ({alignContent, backgroundColor, children}) => {
  const Wrapper = alignContent === ALIGN_VALUES['center'] ? Container : Box
  const responsiveGap = [`${GRID_GUTTER}px`, `${GRID_GUTTER * 2}px`, `${GRID_GUTTER * 3}px`]

  // set padding based to alignContent value
  let pl = alignContent === ALIGN_VALUES['left'] || backgroundColor ? responsiveGap : [0]
  let pr = alignContent === ALIGN_VALUES['right'] || backgroundColor ? responsiveGap : [0]

  return (
    <Wrapper fluid={true} pl={pl} pr={pr} alignContent={`center`} backgroundColor={backgroundColor ? backgroundColor : `transparent`}>
      {children}
    </Wrapper>
  )
}

const AnimatedBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  opacity: ${props => props.opacity};
  transform: translate3d(0, 0px, 0);
  transition: opacity 250ms linear;
`

export class AnimatedBackgroundContainer extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      inView: false,
    }

    this.exitViewportTicker = null

    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.onExitCompleted = this.onExitCompleted.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount() {
    this.context.getScrollbar(s => {
      this.scrollbar = s
    })
  }
  componentWillUnmount() {
    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null

    // cancel timeout
    if( this.exitViewportTicker ) clearTimeout(this.exitViewportTicker)
    this.exitViewportTicker = null
  }

  onVisibilityChange(inView) {
    if( inView ) {
      // if already in view, skip
      if( this.state.inView === true ) return

      // cancel timeout
      clearTimeout(this.exitViewportTicker)

      // register scroll listener
      if( this.scrollbar && !this.exitViewportTicker ) this.scrollbar.addListener(this.onScroll)

      // destroy timeout
      this.exitViewportTicker = null

      // update state
      this.setState({
        inView: true,
        y: this.scrollbar.offset.y,
      })
    }
    else {
      // if already outside of viewport, skip
      if( this.state.inView === false ) return

      // cancel timeout
      clearTimeout(this.exitViewportTicker)
      this.exitViewportTicker = null

      // update state
      this.setState({
        inView: false,
      }, () => {
        this.exitViewportTicker = setTimeout(this.onExitCompleted, 250)
      })
    }
  }
  onExitCompleted() {
    // destroy timeout
    this.exitViewportTicker = null

    // unregister scroll listener
    if( this.scrollbar ) this.scrollbar.removeListener(this.onScroll)
  }
  onScroll({ offset }) {
    this.setState({
      y: offset.y,
    })
  }

  render() {
    const { backgroundColor, children } = this.props
    const { inView, y } = this.state
    const t = { transform: `translate3d(0, ${y}px, 0)`}

    return (
      <InView as={Box} onChange={this.onVisibilityChange}>
        <Box as={AnimatedBg} backgroundColor={backgroundColor} opacity={inView ? 1 : 0} style={t} />
        {children}
      </InView>
    )
  }
}

export const AnimatedBackgroundRowContainer = ({ backgroundColor, children, ...props}) => (
  <AnimatedBackgroundContainer backgroundColor={backgroundColor}>
    <RowContainer {...props}>
      {children}
    </RowContainer>
  </AnimatedBackgroundContainer>
)


const GridColums = itemsPerRow => {
  // since we join the produced array with a string value,
  // we must add an extra cell to the array producing 1 more grid-column.
  // ie: 4 rows need +1. [empty, empty, empty, empty, empty] joined in a string as "1fr 1fr 1fr fr"
  const rows = parseInt(itemsPerRow) + 1
  return new Array(rows).map((item, index) => index).join('1fr ')
}

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: ${props => (props.gaplessGrid ? `0px` : `${props.gridGutter ? props.gridGutter : GRID_GUTTER}px`)};
  align-items: ${props => props.alignItems ? VERTICAL_ALIGN_VALUES[props.alignItems] : `flex-start`};
  position: relative;

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    grid-template-columns: ${props => GridColums(props.itemsPerRow || 1)};
    grid-row-gap: ${props => (props.gaplessGrid ? `0px` : `${props.gridGutter ? props.gridGutter : GRID_GUTTER}px`)};
  }

`


class ContentRow extends Component {

  rows() {
    return this.props.data.map((row, index) => {
      switch (row.__typename) {
        case CONTENT_ROW_TYPES['text']:
          return <ContentText key={index} isFirst={index === 0} data={row} />
        case CONTENT_ROW_TYPES['images']:
          return <ContentImages key={index} isFirst={index === 0} data={row} />
        case CONTENT_ROW_TYPES['videos']:
          return <ContentVideos key={index} isFirst={index === 0} data={row} />
        case CONTENT_ROW_TYPES['slides']:
          return <ContentSlides key={index} isFirst={index === 0} data={row} />
        case CONTENT_ROW_TYPES['section_break']:
          return <ContentSectionBreak key={index} isFirst={index === 0} data={row} />
        default:
          //
          // push an empty row if the `__typename` is unsupported by this component
          //
          return <span key={index}>{row.__typename} unsupported</span>
      }
    })
  }

  render() {
    return (
      <React.Fragment>{this.props.data ? this.rows() : ''}</React.Fragment>
    );
  }
}

ContentRow.propTypes = {
  data: PropTypes.array
}

ContentRow.defaultProps = {
  data: null
}

export default ContentRow;
