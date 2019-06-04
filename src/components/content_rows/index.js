import React, { Component } from 'react';
import PropTypes from 'prop-types'



import { Box } from 'rebass'
import Container from '@styles/Container'
import ContentText from './ContentText'
import ContentImages from './ContentImages'
import ContentVideos from './ContentVideos'

// console.log('ContentfulClient:', ContentfulClient)

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
export const VERTICAL_SPACER = [4,5]

// gutter between each grid elements
export const GRID_GUTTER = 25

export const RowContainer = ({alignContent, children}) => {
  const Wrapper = alignContent === ALIGN_VALUES['center'] ? Container : Box
  const responsiveGap = [`${GRID_GUTTER}px`, `${GRID_GUTTER * 2}px`, `${GRID_GUTTER * 3}px`]

  // set padding based to alignContent value
  let pl = alignContent === ALIGN_VALUES['left'] ? responsiveGap : [0]
  let pr = alignContent === ALIGN_VALUES['right'] ? responsiveGap : [0]

  return (
    <Wrapper pl={pl} pr={pr} alignContent={`center`}>
      {children}
    </Wrapper>
  )
}


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
