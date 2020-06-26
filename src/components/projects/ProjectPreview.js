import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import { useInView } from 'react-intersection-observer'


import ParallaxBox from '@components/elements/ParallaxBox'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { HAS_HOVER } from '@utils/constants'
import FigureBox from '@utils/FigureBox'
import ResponsiveProp from '@utils/ResponsiveProp'


const DEFAULT_COLUMN = {
  width: 1 / 2,
  ml: [0],
  mr: [0],
}

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
  const [hover, setHover] = useState(false)
  const [inViewRef, inView] = useInView({ triggerOnce: true })
  const { slug, colorMain, imageMain, videoPreview, name, category, transitionName } = project.node

  return (
    <Box ref={inViewRef} as={ProjectWrapper} mb={['40px', null, '50px', '70px']} px={[null, null, 3, '28px']} {...columns}>
      <ParallaxBox offset={offset}>
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
    </Box>
  )
}

ProjectPreview.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
  columns: PropTypes.object,
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
}

export default ProjectPreview
