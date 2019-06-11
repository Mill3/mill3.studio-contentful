import React, { Component } from 'react'
import ProximityFeedback from 'react-proximity-feedback'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import FigureBox from '@utils/FigureBox'

import Play from '@svg/Play'

const PREVIEW_MODE_CLASSNAME = `in-preview`

class EmbeddedPlayer extends Component {
  constructor(props) {
    super(props)
    this.startVideo = this.startVideo.bind(this)
    this.state = {
      playing: false,
      visible: false,
    }
  }

  startVideo = () => {
    if (this.refs.player) {
      this.setState({
        playing: true,
      })
    }
  }

  pauseVideo = () => {
    this.setState({
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
        <FigureBox ratio={9 / 16}>
          <PlayerInner>
            {this.props.poster &&
              <>
                <PlayButton
                  visible={!this.state.playing}
                  onClick={() => this.startVideo()}
                >
                  <Play />
                </PlayButton>
                <PlayerPoster visible={!this.state.playing}>
                  <img src={this.props.poster} />
                </PlayerPoster>
              </>
            }
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
  poster: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
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
  transition: opacity 1s;
  opacity: ${props => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? 'all' : 'none')};
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
  cursor: pointer;
  transition: opacity 1s;
  opacity: ${props => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? 'all' : 'none')};
  display: inline-block;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: black;
  color: #fff !important;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: width 0.25s, height 0.25s;

  svg {
    width: 15px;
  }

  &:hover {
    width: 94px;
    height: 94px;
  }
`
