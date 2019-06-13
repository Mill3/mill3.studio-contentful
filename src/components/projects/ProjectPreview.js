import React from 'react'
import { Box, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import { InView } from 'react-intersection-observer'
import { ScrollPercentage } from 'react-scroll-percentage'

import FigureBox from '@utils/FigureBox'
import TransitionLinkComponent from '@utils/TransitionLink'

const ProjectPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 150,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ delay }) => delay,
    transition: {
      type: 'spring',
      stiffness: 30,
      mass: 0.925,
    },
  },
})

const ProjectWrapper = styled.div`
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

  video {
    flex: 0 0 100%;
    height: 100%;
    object-fit: cover;
  }

  .gatsby-image-wrapper {
    flex: 0 0 100%;
    height: 100%;
    img {
      object-position: left top !important;
    }
  }
`

const ProjectPreviewItem = styled(ProjectPoses)`
  figure {
    position: relative;
    overflow: hidden;
    background: ${props => props.color};
  }

  a {
    display: block;
    color: #000;
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }

  /* over pane on top */
  ${ProjectHoverPane} {
    /* transform: translateY(101%); */
    opacity: 0;
    transition: opacity 0.25s ease-in-out;

    video,
    .gatsby-image-wrapper {
      opacity: 0;
      transform: scale(1.05);
      transition-duration: 0.45s;
      transition-timing-function: ease-in-out;
      transition-delay: 0s;
      filter: blur(10px);
    }
  }

  /* hover state */
  &:hover {
    ${ProjectHoverPane} {
      transform: translateY(0%);
      opacity: 1;

      video,
      .gatsby-image-wrapper {
        transition-delay: 0.4s;
        transform: translateY(0%);
        opacity: 1;
        transform: scale(1);
        filter: blur(0px);
      }
    }
  }
`

const ProjectPreview = props => {
  const videoRef = React.createRef()
  const onHover = isHover => {
    if (isHover && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    } else if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const { project, delay, columns, offset } = props
  const { slug, colorMain, imageMain, imageHover, videoPreview, name, category } = project.node
  const Wrapper = offset === 0 ? InView : ScrollPercentage

  let isVisible = false

  return (
    <Wrapper>
      {({ inView = false, percentage = null, ref }) => {
        // once visible once, never set it back to invisible
        if (isVisible === false) {
          isVisible = inView === true || percentage > 0
        }

        // only calculate transformations if required
        const transform = offset === 0 ? {} : { transform: `translate3d(0, ${percentage * offset}px, 0)` }

        return (
          <Box
            as={ProjectWrapper}
            ref={ref}
            px={[0, null, 3, 4]}
            mb={['40px', null, '50px', '70px']}
            {...columns}
          >
            <Box
              as={ProjectPreviewItem}
              delay={delay}
              initialPose={'hidden'}
              pose={isVisible ? 'visible' : 'hidden'}
              width={'100%'}
              color={colorMain}
            >
              <TransitionLinkComponent
                to={`/projects/${slug}`}
                title={name}
                color={colorMain}
                onMouseEnter={e => onHover(true)}
                onMouseLeave={e => onHover(false)}
                style={transform}
              >
                <Box as={`figure`} mb={[4]}>
                  <ProjectHoverPane color={colorMain}>
                    {imageHover && <Img fade={false} fluid={imageHover.fluid} />}
                    {videoPreview && (
                      <video muted playsInline loop ref={videoRef}>
                        <source src={videoPreview.file.url} type="video/mp4" />
                      </video>
                    )}
                  </ProjectHoverPane>
                  <FigureBox>
                    <Img fade={false} fluid={imageMain.fluid} />
                  </FigureBox>
                </Box>

                <Box as={`footer`} px={['5vw', null, 0]}>
                  <Text
                    as={`h3`}
                    className={`fw-300 is-sans`}
                    fontSize={[3, 2, 2, `28px`]}
                    m={[0]}
                  >
                    {name}
                  </Text>
                  {category && (
                    <Text as={`h4`} className={`fw-300 is-serif is-gray`} fontSize={[2, 2, 2, `19px`]} m={0}>
                      {category[0].title}
                    </Text>
                  )}
                </Box>

              </TransitionLinkComponent>
            </Box>
          </Box>
        )
      }}
    </Wrapper>
  )
}

ProjectPreview.defaultProps = {
  delay: 0,
  columns: {
    width: 1 / 2,
    ml: [0],
    mr: [0],
  },
  offset: 0,
}

export default ProjectPreview
