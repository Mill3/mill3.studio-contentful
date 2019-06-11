import React, { Component } from "react"
import styled from 'styled-components'
import PropTypes from "prop-types"
import ReactPlayer from "react-player"
import FigureBox from "@utils/FigureBox"

const PREVIEW_MODE_CLASSNAME = `in-preview`

class EmbeddedPlayer extends Component {
  constructor(props) {
    super(props)
    this.startVideo = this.startVideo.bind(this)
    this.state = {
      previewClassName: PREVIEW_MODE_CLASSNAME,
      playing: false,
      visible: false,
      isstartVideo: false,
    }
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (
  //     this.refs.player.player && this.state.playing
  //   ) {
  //     this.pauseVideo()
  //   }
  // }

  poster = () => {
    if (this.props.poster) {
      return (
        <PlayerPoster visible={!this.state.playing}>
          <img src={this.props.poster} />
        </PlayerPoster>
      )
    }
  }

  playButton = () => {
    if (this.props.poster) {
      return (
        <PlayButton visible={!this.state.playing} onClick={() => this.startVideo()}>
          Play
        </PlayButton>
      )
    }
  }

  startVideo = () => {
    if (this.refs.player) {
      this.setState({
        previewClassName: ``,
        playing: true,
      })
    }
  }

  pauseVideo = () => {
    this.setState({
      previewClassName: PREVIEW_MODE_CLASSNAME,
      playing: false,
    })
  }

  setVisible(visible = false) {
    this.setState({
      isVisible: visible,
    })
  }

  setPlaying() {
    this.setState({
      playing: true,
    })
  }

  render() {
    return (
      <>
        <FigureBox ratio={9/16}>
          <PlayerInner>
            {this.playButton()}
            {this.poster()}
            <ReactPlayer
              ref="player"
              url={this.props.url}
              width="100%"
              height="100%"
              playing={this.state.playing}
              onStart={() => {
                this.setPlaying()
              }}
              onPlay={() => {
                this.startVideo()
              }}
              onPause={() => {
                this.pauseVideo()
              }}
              controls={true}
              config={{
                youtube: {
                  playerVars: { showinfo: 0 },
                },
              }}
            />
          </PlayerInner>
        </FigureBox>
      </>

    )
  }
}

EmbeddedPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  poster: PropTypes.object,
}

export default EmbeddedPlayer

const PlayerInner = styled.div`
  position: relative;
  height: 100%;
`

const PlayerPoster = styled.figure`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  display: ${props => props.visible ? 'block' : 'none'};
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`

export const PlayButton = styled.a`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  display: ${props => props.visible ? 'block' : 'none'};
  width: 80px;
  height: 80px;
  background: black;
  color: #fff !important;
  text-align: center;
  border-radius: 50%;
`