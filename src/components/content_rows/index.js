import React, { Component } from 'react';
import PropTypes from 'prop-types'

import ContentText from './ContentText'
import ContentImages from './ContentImages'
import ContentVideos from './ContentVideos'

class ContentRow extends Component {

  rows() {
    const rows = []

    this.props.data.map((row, index) => {
      switch (row.__typename) {
        case "ContentfulContentText":
          rows.push(<ContentText key={index} data={row} />)
          break;
        case "ContentfulContentImages":
          rows.push(<ContentImages key={index} data={row} />)
          break;
        case "ContentfulContentVideos":
          rows.push(<ContentVideos key={index} data={row} />)
          break;
        default:
          // push empty row if the __typename is unsupported
          rows.push(<span key={index} />)
      }
    })

    return rows
  }

  render() {
    return (
      <React.Fragment>{this.rows()}</React.Fragment>
    );
  }
}

ContentRow.propTypes = {
  data: PropTypes.array.isRequired
}

export default ContentRow;