import React, { Component } from 'react'
import { ContentfulClient } from '@utils/ContentfulClient'

class EmbeddedAsset extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: null
    }
  }

  componentDidMount() {
    console.log(`getting asset : ${this.props.id}`);
    if (!this.state.url) {
      ContentfulClient()
        .getAsset(this.props.id)
          .then(asset => {
            console.log(asset)
            this.setState({
              url: asset.fields.file.url
            })
          })
          .catch(err => console.log(err))
    }
  }

  render() {
    return (
      <div>
        {this.props.id}
        {this.state.url &&
          <img src={this.state.url} className="img-fluid" />
        }
      </div>
    )
  }
}

export default EmbeddedAsset
