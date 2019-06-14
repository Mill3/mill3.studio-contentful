import React, { Component } from 'react'
import ProximityFeedback from 'react-proximity-feedback'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { InView } from 'react-intersection-observer'

import Play from '@svg/Play'
import FigureBox from '@utils/FigureBox'


class EmbeddedPlayer extends Component {
  constructor(props) {
    super(props)

    this.startVideo = this.startVideo.bind(this)
    this.pauseVideo = this.pauseVideo.bind(this)
    this.setVisible = this.setVisible.bind(this)
    this.setPlaying = this.setPlaying.bind(this)

    this.playRef = React.createRef()
    this.state = {
      playing: false,
      visible: false,
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.playRef &&
      this.playRef.current &&
      this.state.playing &&
      !this.state.isVisible
    ) {
      this.pauseVideo()
    }
  }

  startVideo = () => {
    if (this.playRef && this.playRef.current) {
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
      <InView onChange={({inView}) => this.setVisible(inView)}>
        {({ inView, ref }) => (
          <FigureBox ref={ref} ratio={9 / 16}>
            <PlayerInner>
              {this.props.poster && (
                <>
                  <ProximityFeedback throttleInMs={1}>
                    {({ ref, distance }) => (
                      <PlayButton
                        ref={ref}
                        visible={!this.state.playing}
                        scale={(distance < 300) ? 1 + ((300 - distance) / 750) : 1}
                        onClick={() => this.startVideo()}
                      >
                        <Play />
                      </PlayButton>
                    )}
                  </ProximityFeedback>
                  <PlayerPoster visible={!this.state.playing}>
                    <img src={this.props.poster} alt="" />
                  </PlayerPoster>
                </>
              )}
              <ReactPlayer
                ref={this.playRef}
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
        )}
      </InView>
    )
  }
}

EmbeddedPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  poster: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
  transition: opacity 1s, transform 0.125s;
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
  opacity: ${props => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? 'all' : 'none')};
  display: inline-block;
  transform: ${props => (`translate(-50%, -50%) scale(${props.scale})`)};
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

  /* &:hover {
    width: 94px;
    height: 94px;
  } */
`
