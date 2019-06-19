import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import { InView } from 'react-intersection-observer'
import { debounce } from 'lodash'

import FigureBox from '@utils/FigureBox'
import TransitionLinkComponent from '@utils/TransitionLink'
import Viewport from '@utils/Viewport'

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

const ProjectWrapper = styled(Box)`
  footer {
    padding-left: 5vw;
    padding-right: 5vw;
  }

  @media (max-width: 767px) {
    &:nth-child(even) {
      padding-left: 5vw;
      padding-right: 5vw;

      footer {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }  

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

class ProjectPreview extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }
  static defaultProps = {
    delay: 0,
    columns: {
      width: 1 / 2,
      ml: [0],
      mr: [0],
    },
    offset: 0,
  }

  constructor(props) {
    super(props)

    this.state = {
      inView: false,
      percentage: 0,
    }

    this.mounted = false
    this.rootRef = React.createRef()
    this.videoRef = React.createRef()

    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.onHover = this.onHover.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
    this.debouncedOnResize = debounce(this.onResize, 750)
  }

  componentDidMount() {
    this.mounted = true
    if( this.props.offset === 0 ) return

    this.context.getScrollbar(s => {
      this.scrollbar = s
      this.scrollbar.addListener(this.onScroll)

      Viewport.on(this.debouncedOnResize)
      this.onResize()
    })
  }
  componentWillUnmount() {
    this.mounted = false

    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null

    Viewport.off(this.debouncedOnResize)
  }

  onVisibilityChange(inView) {
    this.setState({
      inView,
    })
  }
  onHover(isHover) {
    if (isHover && this.videoRef.current) {
      this.videoRef.current.currentTime = 0
      this.videoRef.current.play()
    } else if (this.videoRef.current) {
      this.videoRef.current.pause()
    }
  }
  onScroll({ offset }) {
    if( !this.mounted || !this.state.inView || this.props.offset === 0 || !this.rect ) return

    const h = this.rect.height
    const vh = Viewport.height + h - this.rect.offset
    const y = this.rect.y + h - offset.y
    const dist = y / vh
    const percentage = Math.max(0, Math.min(1, 1 - dist)) // from 0 to 1

    if( this.state.percentage === percentage ) return

    this.setState({
      percentage,
    })
  }
  onResize() {
    if( !this.rootRef || !this.rootRef.current || !this.rootRef.current.node || !this.scrollbar ) return

    const rect = this.rootRef.current.node.getBoundingClientRect()
    const y = rect.y + this.scrollbar.offset.y

    this.rect = {
      y: y,
      height: rect.height,
      offset: Math.max(0, Viewport.height - y),
    }
  }

  render() {
    const { project, delay, columns, offset } = this.props
    const { slug, colorMain, imageMain, imageHover, videoPreview, name, category } = project.node
    const { inView, percentage } = this.state

    // only calculate transformations if required
    const transform = (inView && offset !== 0) ? { transform: `translate3d(0, ${percentage * offset}px, 0)` } : {}

    return (
      <InView
        ref={this.rootRef}
        triggerOnce={true}
        onChange={this.onVisibilityChange}
        as={ProjectWrapper}
        px={[null, null, 3, 4]}
        mb={['40px', null, '50px', '70px']}
        {...columns}
      >
        <Box
          as={ProjectPreviewItem}
          delay={delay}
          initialPose={'hidden'}
          pose={inView ? 'visible' : 'hidden'}
          width={'100%'}
          color={colorMain}
        >
          <TransitionLinkComponent
            to={`/projects/${slug}`}
            title={name}
            color={colorMain}
            onMouseEnter={e => this.onHover(true)}
            onMouseLeave={e => this.onHover(false)}
            style={transform}
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
                <Img fade={false} fluid={imageMain.fluid} objectFit="cover" objectPosition="center center" style={{ height: `100%` }} />
              </FigureBox>
            </Box>

            <Box as={`footer`} px={[null, null, 0]}>
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
      </InView>
    )
  }
}

export default ProjectPreview
