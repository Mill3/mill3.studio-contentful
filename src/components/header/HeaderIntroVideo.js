import React, { forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { Box } from 'rebass'
import { injectIntl } from 'gatsby-plugin-intl'
import { useInView } from 'react-intersection-observer'


import { LayoutContext } from '@layouts/layoutContext'
import { space } from '@styles/Theme'
import { HAS_HOVER } from '@utils/constants'
import { lerp } from '@utils/Math'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'



const VideoPlayerPoses = posed.video({
    default: {
        right: 0,
        width: '100%',
        height: '100%',
        transition: {
        type: 'tween',
        duration: 950,
        delay: 350,
        ease: [0.645, 0.045, 0.355, 1.0],
        },
        flip: true,
    },
    fullscreen: {
        right: () => videoPlayerRightOffset.getValue(),
        width: () => videoPlayerWidth.getValue(),
        height: () => videoPlayerHeight.getValue(),
        transition: {
        type: 'tween',
        duration: 1250,
        ease: [0.645, 0.045, 0.355, 1.0],
        },
        flip: true,
    },
})
const VideoPlaybackPoses = posed.button({
    visible: {
        opacity: 1,
        delay: 850,
    },
    hidden: {
        opacity: 0,
        delay: 0,
    },
})

const VideoPlayerStyle = styled(VideoPlayerPoses)`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`
const VideoPlaybackStyle = styled(VideoPlaybackPoses)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  background: none;
  border: 2px solid currentColor;
  border-radius: 100%;
  color: currentColor;
  text-transform: uppercase;
  position: absolute;
  top: ${HAS_HOVER ? '-47px' : '50%'};
  right: ${HAS_HOVER ? '-47px' : '50%'};
  outline: none !important;
  cursor: pointer;
  transform-origin: center center;
  transform: ${HAS_HOVER ? 'translate3d(0px, 0px, 0)' : 'translate(50%, -50%) !important'};
`

const videoPlayerRightOffset = new ResponsiveProp([-24, space[4] * -1, '-5vw'])
const videoPlayerWidth = new ResponsiveProp(['100vw', null, null, '60vw'])
const videoPlayerHeight = new ResponsiveProp(['100vw', null, null, '100vh'])


const PLAY_BUTTON_DEFAULT = {
    x: -72,
    y: 0,
}
const PLAY_BUTTON_LERP = 0.08
const PLAY_BUTTON_SPRING = 0.05
const PLAY_BUTTON_FRICTION = 0.8

const VIDEO_LOOP_START_AT = 0
const VIDEO_LOOP_END_AT = 8

const VIDEO_MAX_VOLUME = 0.75
const VIDEO_VOLUME_FADE_IN_SPEED = 0.01

const HeaderIntroVideo = ({ forwardedRef, intl, video, ...rest }) => {
    const hitzoneRef = useRef()
    const videoRef = useRef()
    const raf = useRef()
    const rafFadeVolume = useRef()
    const mouseEvent = useRef()
    const size = useRef()
    const playbackPromise = useRef()
    const currentPosition = useRef({ ...PLAY_BUTTON_DEFAULT })
    const targetPosition = useRef({ ...PLAY_BUTTON_DEFAULT })
    const velocity = useRef({ x: 0, y: 0 })

    const { layoutState } = useContext(LayoutContext)
    const [ position, setPosition ] = useState(PLAY_BUTTON_DEFAULT)
    const [ started, setStarted ] = useState(false)
    const [ muted, setMuted ] = useState(true)
    const [ inViewRef, inView ] = useInView()
    const { demoReel } = layoutState
    const { active } = demoReel

    const resize = useCallback(() => {
        size.current = hitzoneRef.current?.getBoundingClientRect()
    })
    const fadeVolume = useCallback(() => {
        if(videoRef.current.volume >= VIDEO_MAX_VOLUME) {
            cancelAnimationFrame(rafFadeVolume.current)
            return
        };

        videoRef.current.volume = videoRef.current.volume += VIDEO_VOLUME_FADE_IN_SPEED

        rafFadeVolume.current = requestAnimationFrame(fadeVolume)
    })
    const animate = useCallback(() => {
        const { width, height } = size.current

        if (mouseEvent.current) {
            const { offsetX, offsetY } = mouseEvent.current

            targetPosition.current.x = offsetX - width
            targetPosition.current.y = offsetY

            currentPosition.current.x = lerp(currentPosition.current.x, targetPosition.current.x, PLAY_BUTTON_LERP)
            currentPosition.current.y = lerp(currentPosition.current.y, targetPosition.current.y, PLAY_BUTTON_LERP)
        } else {
            targetPosition.current.x = width * -0.5
            targetPosition.current.y = height * 0.5

            const ax = (targetPosition.current.x - currentPosition.current.x) * PLAY_BUTTON_SPRING
            const ay = (targetPosition.current.y - currentPosition.current.y) * PLAY_BUTTON_SPRING

            velocity.current.x += ax
            velocity.current.y += ay

            velocity.current.x *= PLAY_BUTTON_FRICTION
            velocity.current.y *= PLAY_BUTTON_FRICTION

            currentPosition.current.x += velocity.current.x
            currentPosition.current.y += velocity.current.y
        }

        // update state
        setPosition({x: currentPosition.current.x, y: currentPosition.current.y})

        // request new frame
        raf.current = requestAnimationFrame(animate)
    })
    const play = useCallback(() => {
        // if a play promise exists, make sure video is playing when resolve, then, skip here
        if( playbackPromise.current ) {
            playbackPromise.current.then(() => {
                if (videoRef.current.paused) return videoRef.current?.play()
            })

            return
        }

        // auto clear promise when done
        playbackPromise.current = videoRef.current?.play().finally(() => playbackPromise.current = null)
    })
    const pause = useCallback(() => {
        // if a play promise exists, wait promise.resolve to pause playback
        // otherwise, pause immediatly
        if( playbackPromise.current ) playbackPromise.current.then(() => videoRef.current?.pause())
        else videoRef.current?.pause()
    })
    const onPoseComplete = useCallback((poseName) => {
        if( poseName !== 'fullscreen' ) return

        // restart video playback and unmute audio

        // start video volume fade in with requestAnimationFrame
        if( rafFadeVolume.current ) cancelAnimationFrame(rafFadeVolume.current)
        rafFadeVolume.current = null

        // start fade in, force volume to 0
        videoRef.current.volume = 0
        requestAnimationFrame(fadeVolume)

        // unmute playback
        setMuted(false)
    })


    // executed only during mount & unmount phases
    useEffect(() => {
        resize()
        Viewport.on(resize)

        return () => {
            if( raf.current ) cancelAnimationFrame(raf.current)
            raf.current = null

            Viewport.off(resize)
            pause()
        }
    }, [])

    // executed only when inView change
    useEffect(() => {
        // play video if inView, otherwise pause video
        if( inView ) play()
        else pause()
    }, [inView])

    // executed only when started change
    useEffect(() => {
        // start by clearing previous rAF
        if( raf.current ) cancelAnimationFrame(raf.current)
        raf.current = null

        if( started ) raf.current = requestAnimationFrame(animate)
    }, [started])

    // executed only when active change
    useEffect(() => {
        // when demoReel is inactive, mute video
        if( active === false ) setMuted(true)
    }, [ active ])


    const { x, y } = position
    const [ playerPose, buttonPose ] = useMemo(() => active ? ['fullscreen', 'hidden'] : ['default', 'visible'], [active])

    return (
        <Box ref={forwardedRef} css={{ position: 'relative' }} {...rest}>
            <Box ref={inViewRef} width={['100%']} height={0} pb={['100%']} css={{ position: 'relative' }}>
                <Box
                    as={VideoPlayerStyle}
                    ref={videoRef}
                    onTimeUpdate={() => {
                        // if video is fullscreen, do not activate synthetic loop
                        if (active) return

                        // get video timestamp
                        const { currentTime } = videoRef.current

                        // if timestamp is higher than looping timestamp, set timestamp to loop beginning
                        if (currentTime > VIDEO_LOOP_END_AT) videoRef.current.currentTime = VIDEO_LOOP_START_AT
                    }}
                    disablePictureInPicture
                    muted={muted}
                    playsInline
                    preload="auto"
                    loop
                    src={video?.file?.url}
                    initialPose="default"
                    pose={playerPose}
                    onPoseComplete={onPoseComplete}
                />
            </Box>

            <Box
                as={VideoPlaybackStyle}
                initialPose="visible"
                pose={buttonPose}
                style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
            >
                {intl.formatMessage({ id: 'demoReel.Play' })}
            </Box>

            {HAS_HOVER && (
                <Box
                    ref={hitzoneRef}
                    width={['100%']}
                    height={'100%'}
                    css={{ position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                        mouseEvent.current = e.nativeEvent
                        setStarted(true)
                    }}
                    onMouseLeave={() => mouseEvent.current = null}
                    onMouseMove={(e) => mouseEvent.current = e.nativeEvent}
                />
            )}
        </Box>
    )
}

const IntlHeaderIntroVideo = injectIntl(HeaderIntroVideo)
const ForwardedBoxVideo = forwardRef((props, ref) => <IntlHeaderIntroVideo {...props} forwardedRef={ref} />)

export default React.memo(ForwardedBoxVideo)