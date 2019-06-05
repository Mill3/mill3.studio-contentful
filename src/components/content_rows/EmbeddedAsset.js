import React, { Component } from 'react'
import { ContentfulClient } from '@utils/ContentfulClient'
import { Box } from 'rebass'

import { VERTICAL_SPACER } from './index'

class EmbeddedAsset extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: null
    }
  }

  componentDidMount() {
    // console.log(`getting asset : ${this.props.id}`);
    if (!this.state.url) {
      ContentfulClient()
        .getAsset(this.props.id)
          .then(asset => {
            console.warn(asset)
            this.setState({
              url: asset.fields.file.url
            })
          })
          .catch(err => console.error(err))
    }
  }

  render() {
    return (
      <Box my={VERTICAL_SPACER}>
        {this.state.url &&
          <img src={this.state.url} className="img-fluid" alt="" />
        }
      </Box>
    )
  }
}

export default EmbeddedAsset
