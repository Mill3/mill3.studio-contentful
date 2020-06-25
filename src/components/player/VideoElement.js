import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'
import { useInView } from 'react-intersection-observer'

const VideoElementStyle = styled.video`
  margin: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const VideoElement = ({ asset }) => {
  const videoRef = useRef()
  const [ inViewRef, inView ] = useInView()

  // Use `useCallback` so we don't recreate the function on each render - Could result in infinite loop
  const setRefs = useCallback(node => {
    // Ref's from useRef needs to have the node assigned to `current`
    videoRef.current = node

    // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
    inViewRef(node)
  }, [inViewRef])

  // play/pause video when inView status change
  useEffect(() => {
    videoRef.current?.[inView ? 'play' : 'pause']()
    return () => videoRef.current?.pause()
  }, [inView])

  return (
    <Box as={VideoElementStyle} ref={setRefs} loop playsInline muted>
      <source src={asset.file.url} type={asset.file.contentType} />
    </Box>
  );
}

export default VideoElement