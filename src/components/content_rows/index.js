import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { Box } from 'rebass'
import Container from '@styles/Container'
import ContentText from './ContentText'
import ContentImages from './ContentImages'
import ContentVideos from './ContentVideos'

// responsive value between each row
// this value is used in Rebass margin properties
export const VERTICAL_SPACER = [3,5]

// gutter between each grid element
export const GRID_GUTTER = 25

export const RowContainer = ({alignContent, children}) => {
  const Wrapper = alignContent === 'center' ? Container : Box
  const gap = [`${GRID_GUTTER}px`, `${GRID_GUTTER * 2}px`, `${GRID_GUTTER * 3}px`]
  let pl = [0]
  let pr = [0]

  if (alignContent === 'snap-left') {
    pr = gap
  }

  if (alignContent === 'snap-right') {
    pl = gap
  }

  return (
    <Wrapper pl={pl} pr={pr}>{children}</Wrapper>
  );
}


class ContentRow extends Component {

  rows() {
    return this.props.data.map((row, index) => {
      switch (row.__typename) {
        case "ContentfulContentText":
          return <ContentText key={index} data={row} />
        case "ContentfulContentImages":
          return <ContentImages key={index} data={row} />
        case "ContentfulContentVideos":
          return <ContentVideos key={index} data={row} />
        default:
          //
          // push an empty row if the `__typename` is unsupported by this component
          //
          return <span key={index} />
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
