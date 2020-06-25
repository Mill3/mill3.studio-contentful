import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { Box } from 'rebass'
import { useInView } from 'react-intersection-observer'
import { useProximityFeedback } from 'react-proximity-feedback'

import Play from '@svg/Play'
import FigureBox from '@utils/FigureBox'


const EmbeddedPlayer = ({ url, poster }) => {
  const playRef = useRef()
  const [ playing, setPlaying ] = useState(false)
  const [ inViewRef, inView ] = useInView()
  const [ proximityRef, distance ] = useProximityFeedback({ throttleInMs: 1000 / 60 })

  return (
    <FigureBox ref={inViewRef} ratio={9 / 16}>
      <Box as={PlayerInner}>
        {poster && (
          <>
            <PlayButton
              ref={proximityRef}
              visible={!playing}
              scale={(distance < 300) ? 1 + ((300 - distance) / 750) : 1}
              onClick={() => setPlaying(true)}
            >
              <Play />
            </PlayButton>

            <Box as={PlayerPoster} visible={!playing}>
              <img src={poster} alt="" />
            </Box>
          </>
        )}
        <ReactPlayer
          ref={playRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing && inView}
          onStart={() => setPlaying(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          controls={true}
          config={{
            youtube: {
              playerVars: { showinfo: 0 },
            },
          }}
        />
      </Box>
    </FigureBox>
  )
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
