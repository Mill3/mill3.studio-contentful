import React, { Component } from 'react';
import PropTypes from 'prop-types'

import ContentText from './ContentText'
import ContentImages from './ContentImages'
import ContentVideos from './ContentVideos'

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
