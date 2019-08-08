import React, { Component } from 'react'
import styled from 'styled-components'
import { InView } from 'react-intersection-observer'

const VideoElementStyle = styled.video`
  margin: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

class VideoElement extends Component {

  constructor(props) {
    super(props);
    this.videoRef = React.createRef()
    this.togglePlayback = this.togglePlayback.bind(this)
  }

  togglePlayback(inView) {
    this.videoRef.current && inView ? this.videoRef.current.play() : this.videoRef.current.pause()
  }

  render() {
    const { asset } = this.props

    return (
      <InView onChange={(v) => this.togglePlayback(v)}>
        {({ ref }) => (
          <div ref={ref}>
            <VideoElementStyle ref={this.videoRef} loop playsInline muted>
              <source src={asset.file.url} type={asset.file.contentType} />
            </VideoElementStyle>
          </div>
        )}
        </InView>
    );
  }
}

export default VideoElement