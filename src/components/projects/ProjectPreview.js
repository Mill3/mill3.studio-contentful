import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import VisibilitySensor from 'react-visibility-sensor'

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
    delay: ({ index }) => ((index % 3) + 1) * 125 + (index < 3 ? 250 : 0),
    transition: {
      type: 'spring',
      stiffness: 30,
      mass: 0.925,
    },
  },
})

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

class ProjectPreview extends React.Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      reveal: false,
      y: 0,
    }

    // refs
    this.videoRef = React.createRef()

    // bind events
    this.onChange = this.onChange.bind(this)
    this.hover = this.hover.bind(this)
  }

  onChange(isVisible) {
    if (isVisible && !this.state.reveal) {
      this.setState({
        reveal: true,
      })
    }
  }

  hover(isHover) {
    if (isHover && this.videoRef.current) {
      this.videoRef.current.currentTime = 0
      this.videoRef.current.play()
    } else if (this.videoRef.current) {
      this.videoRef.current.pause()
    }
  }

  componentDidMount() {
    if( this.props.offset === 0 ) return;

    this.context.getScrollbar((scrollbar) => {
      scrollbar.addListener(({ offset }) => {
        this.setState({
          y: offset.y * this.props.offset,
        })
      });
    });
  }

  render() {
    let {
      slug,
      colorMain,
      imageMain,
      imageHover,
      videoPreview,
      name,
    } = this.props.project.node

    return (
      <VisibilitySensor
        onChange={this.onChange}
        partialVisibility={true}
      >
        <Box
          as={ProjectPreviewItem}
          index={this.props.index}
          initialPose={'hidden'}
          pose={this.state.reveal ? 'visible' : 'hidden'}
          pl={[2]}
          pr={[2]}
          mb={[2, 2, '5vh']}
          {...this.props.columns}
          color={colorMain}
        >
          <TransitionLinkComponent
            to={`/projects/${slug}`}
            title={name}
            color={colorMain}
            onMouseEnter={e => this.hover(true)}
            onMouseLeave={e => this.hover(false)}
            style={{transform: `translate3d(0, ${this.state.y}px, 0)`}}
          >
            <Box as={`figure`} mb={[4]}>
              <ProjectHoverPane color={colorMain}>
                {imageHover && <Img fade={false} fluid={imageHover.fluid} />}
                {videoPreview && (
                  <video muted playsInline loop ref={this.videoRef}>
                    <source src={videoPreview.file.url} type="video/mp4" />
                  </video>
                )}
              </ProjectHoverPane>
              <FigureBox>
                <Img fade={false} fluid={imageMain.fluid} />
              </FigureBox>
            </Box>
            <footer>
              <Text
                as={`h3`}
                className={`fw-300 is-sans`}
                fontSize={[3, 3, 4]}
                mb={[0]}
              >
                {name}
              </Text>
              <Text
                as={`h4`}
                className={`fw-300 is-serif is-gray`}
                fontSize={[3]}
              >
                Branding
              </Text>
            </footer>
          </TransitionLinkComponent>
        </Box>
      </VisibilitySensor>
    )
  }
}

ProjectPreview.defaultProps = {
  index: 0,
  columns: {
    width: 1 / 2,
    ml: [0],
    mr: [0],
  },
  offset: 0,
}

export default ProjectPreview
