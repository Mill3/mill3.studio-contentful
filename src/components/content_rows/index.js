import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'rebass'

import Container from '@styles/Container'
import ContentText from './ContentText'
import ContentImages from './ContentImages'
import ContentVideos from './ContentVideos'

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
}

// responsive value between each row
// this value is used in Rebass margin properties
export const VERTICAL_SPACER = [4,5,6]

// gutter between each grid elements
export const GRID_GUTTER = 25

export const RowContainer = ({alignContent, backgroundColor, children}) => {
  const Wrapper = alignContent === ALIGN_VALUES['center'] ? Container : Box
  const responsiveGap = [`${GRID_GUTTER}px`, `${GRID_GUTTER * 2}px`, `${GRID_GUTTER * 3}px`]

  // set padding based to alignContent value
  let pl = alignContent === ALIGN_VALUES['left'] ? responsiveGap : [0]
  let pr = alignContent === ALIGN_VALUES['right'] ? responsiveGap : [0]

  return (
    <Wrapper pl={pl} pr={pr} alignContent={`center`} backgroundColor={backgroundColor ? backgroundColor : `transparent`}>
      {children}
    </Wrapper>
  )
}

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
  }
`


class ContentRow extends Component {

  rows() {
    return this.props.data.map((row, index) => {
      switch (row.__typename) {
        case CONTENT_ROW_TYPES['text']:
          return <ContentText key={index} data={row} />
        case CONTENT_ROW_TYPES['images']:
          return <ContentImages key={index} data={row} />
        case CONTENT_ROW_TYPES['videos']:
          return <ContentVideos key={index} data={row} />
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
