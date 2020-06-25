import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import { InView } from 'react-intersection-observer'

import TransitionLinkComponent from '@components/transitions/TransitionLink'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { LayoutContext } from '@layouts/layoutContext'
import { breakpoints } from '@styles/Theme'
import { HAS_HOVER } from '@utils/constants'
import FigureBox from '@utils/FigureBox'
import { limit as between } from '@utils/Math'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'

const DEFAULT_COLUMN = {
  width: 1 / 2,
  ml: [0],
  mr: [0],
}
const TRANSFORM_NONE = {}

const ProjectPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 150,
    scale: 1.125,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    delay: ({ delay }) => delay,
    transition: {
      type: 'spring',
      stiffness: 30,
      mass: 0.925,
    },
  }
})

const ProjectWrapper = styled(Box)`
  &:last-child {
    margin-bottom: 0 !important;
  }
`

const ProjectHoverPane = styled.picture`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: ${props => props.color};
  opacity: 0;
  transition: opacity 0.25s ease-in-out;

  video {
    flex: 0 0 100%;
    height: 100%;
    object-fit: cover;
  }
`

/*
const ProjectTitleUnderlinePoses = posed.span({
  fold: {
    scaleX: 0.0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 40,
    },
  },
  unfold: {
    scaleX: 0.999,
    transition: {
      type: 'spring',
      stifness: 100,
      damping: 10,
    },
  },
})
*/

/*
const ProjectTitleUnderline = styled(ProjectTitleUnderlinePoses)`
  position: absolute;
  top: 1.125em;
  left: 0;
  width: 100%;
  height: 0.045em;
  z-index: -1;
  background: ${props => (props.color ? props.color : props.theme.colors.black)};
  transform-origin: top left;
  transform: scaleX(0.999);
`
*/

const ProjectPreviewItem = styled(ProjectPoses)`
  transform-origin: top center;
  
  figure {
    position: relative;
    overflow: hidden;
    background: ${props => props.color};
  }

  a {
    display: block;
    color: #000;
    text-decoration: none;

    h3 {
      transition: color 0.25s;
      /*
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 100%;
      text-shadow: 0.03em 0 #fff, -0.03em 0 #fff, 0 0.03em #fff, 0 -0.03em #fff, 0.06em 0 #fff, -0.06em 0 #fff,
        0.09em 0 #fff, -0.09em 0 #fff, 0.12em 0 #fff, -0.12em 0 #fff, 0.15em 0 #fff, -0.15em 0 #fff;
      */
    }

    /* hover state */
    &:hover {
      text-decoration: none;

      h3 {
        color: ${props => props.color};
      }

      ${ProjectHoverPane} {
        opacity: 1;
      }
    }
  }
`


const ParallaxBox = ({ active = false, offset = 0, children, ...props }) => {
  const ref = useRef()
  const boundaries = useRef(null)
  const [ percentage, setPercentage ] = useState(0)
  const { layoutState } = useContext(LayoutContext)
  const { scrollbar } = layoutState

  const resize = () => {
    const value = offset instanceof ResponsiveProp ? offset.getValue() : offset
    const rect = ref.current.getBoundingClientRect()
    const y = rect.y + scrollbar.offset.y

    boundaries.current = {
      y: y,
      height: rect.height + value,
      limit: Math.max(0, Viewport.height - y),
    }
  }
  const scroll = (data) => {
    if( !active ) return

    // get scroll y
    const scrollY = data.offset.y
    let newValue

    // if offset equal zero
    if( offset instanceof ResponsiveProp && offset.getValue() === 0 ) {
      newValue = 0
    } else {
      const { y, height, limit } = boundaries.current
      const vh = Viewport.height + height - limit
      const top = y + height - scrollY
      const dist = top / vh

      newValue = between(0, 1, 1 - dist)
    }

    // update state only if required
    if (percentage !== newValue) setPercentage(newValue)
  }

  // listening to viewport's resize
  useEffect(() => {
    Viewport.on(resize)
    return () => Viewport.off(resize)
  }, [])


  // listening to scrolling
  useEffect(() => {
    if( scrollbar ) resize()
    scrollbar?.addListener(scroll)
    return () => scrollbar?.removeListener(scroll)
  }, [scrollbar, active])


  let transform

  // only calculate transformations if required
  if (active) {
    const value = offset instanceof ResponsiveProp ? offset.getValue() : offset
    transform = value !== 0 ? { transform: `translate3d(0, ${percentage * value}px, 0)` } : TRANSFORM_NONE
  }
  else transform = TRANSFORM_NONE

  return (
    <Box as="div" ref={ref} style={transform} {...props}>
      {children}
    </Box>
  )
}

ParallaxBox.propTypes = {
  active: PropTypes.bool,
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
}

const ProjectFigure = ({ active = false, color = '#000', video = null, image = null, ...props }) => {
  const setVideoRef = (ref) => {
    if( !ref ) return

    if( active && ref.paused ) {
      ref.currentTime = 0
      ref.play()
    }
    else if( !active && !ref.paused ) ref.pause()
  }

  return (
    <Box as={`figure`} {...props}>
      {HAS_HOVER && (
        <ProjectHoverPane color={color}>
          {video && (
            <video ref={setVideoRef} muted playsInline loop>
              <source src={video.file.url} type="video/mp4" />
            </video>
          )}
        </ProjectHoverPane>
      )}
      <FigureBox>
        <Img
          fade={false}
          fluid={image.fluid}
          objectFit="cover"
          objectPosition="center center"
          style={{ height: `100%` }}
        />
      </FigureBox>
    </Box>
  )
}

const ProjectPreview = ({ project, delay = 0, columns = DEFAULT_COLUMN, offset = 0 }) => {
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState(false)
  const { slug, colorMain, imageMain, videoPreview, name, category, transitionName } = project.node

  return (
    <InView
      triggerOnce={true}
      onChange={v => setInView(v)}
      as={ProjectWrapper}
      mb={['40px', null, '50px', '70px']}
      px={[null, null, 3, '28px']}
      {...columns}
    >
      <ParallaxBox active={inView} offset={offset}>
        <Box
          as={ProjectPreviewItem}
          initialPose={'hidden'}
          pose={inView ? 'visible' : 'hidden'}
          delay={delay instanceof ResponsiveProp ? delay.getValue() : delay}
          width={'100%'}
          color={colorMain}
        >
          <TransitionLinkComponent
            to={`/projects/${slug}/`}
            title={transitionName || null}
            color={colorMain}
            onMouseOver={e => setHover(true)}
            onMouseOut={e => setHover(false)}
            onFocus={e => setHover(true)}
            onBlur={e => setHover(false)}
          >
            <TransitionContainer direction="out" distance={150}>
              <ProjectFigure
                color={colorMain}
                video={videoPreview}
                image={imageMain}
                active={hover}
                mb={[2,2,4]}
              ></ProjectFigure>

              <Flex as={`footer`} flexDirection="column" alignItems="start" px={['5vw', null, 0]}>
                <Text
                  as={'h3'}
                  className={`fw-300 is-sans is-relative`}
                  fontSize={['5.314009662vw', null, `3vw`, `1.944444444vw`]}
                  m={[0]}
                >
                  {name}
                  {/*
                  <span>{name}</span>
                  <Box
                    as={ProjectTitleUnderline}
                    color={colorMain}
                    initialPose="fold"
                    pose={hover ? 'unfold' : 'fold'}
                    aria-hidden="true"
                  />
                  */}
                </Text>
                {category && (
                  <Text
                    as={`h4`}
                    className={`fw-300 is-serif is-gray`}
                    fontSize={['3.623188406vw', null, `2.045454546vw`, `1.319444444vw`]}
                    m={0}
                  >
                    {category[0].title}
                  </Text>
                )}
              </Flex>
            </TransitionContainer>
          </TransitionLinkComponent>
        </Box>
      </ParallaxBox>
    </InView>
  )
}

ProjectPreview.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
  columns: PropTypes.object,
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
}

export default ProjectPreview
