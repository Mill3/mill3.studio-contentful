import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import { InView } from 'react-intersection-observer'
import { debounce } from 'lodash'

import { breakpoints } from '@styles/Theme'
import FigureBox from '@utils/FigureBox'
import ResponsiveProp from '@utils/ResponsiveProp'
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
  @media (max-width: ${parseInt(breakpoints[1]) - 1}px) {
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
const ProjectTitleUnderline = styled(ProjectTitleUnderlinePoses)`
  position: absolute;
  top: 1.2em;
  left: 0;
  width: 100%;
  height: 0.075em;
  background: ${props => props.theme.colors.black};
  transform-origin: top left;
  transform: scaleX(0.999);
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
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  /* hover state */
  &:hover {
    ${ProjectHoverPane} {
      opacity: 1;
    }
  }
`



class ProjectPreview extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }
  static propTypes = {
    delay: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
    columns: PropTypes.object,
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
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
      hover: false,
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
    if( this.mounted ) {
      this.setState({ hover: isHover }, () => {
        if (isHover && this.videoRef.current) {
          this.videoRef.current.currentTime = 0
          this.videoRef.current.play()
        } else if (this.videoRef.current) {
          this.videoRef.current.pause()
        }
      })
    }
  }
  onScroll({ offset }) {
    if( !this.mounted || !this.state.inView || !this.rect ) return
    if( this.props.offset instanceof ResponsiveProp && this.props.offset.getValue() === 0 ) {
      if( this.state.percentage !== 0 ) this.setState({ percentage: 0 })
      return
    }

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
    const { inView, percentage, hover } = this.state
    let transform


    // only calculate transformations if required
    if( inView ) {
      const value = offset instanceof ResponsiveProp ? offset.getValue() : offset
      transform = value !== 0 ? { transform: `translate3d(0, ${percentage * value}px, 0)` } : {}
    }
    else transform = {}


    return (
      <InView
        ref={this.rootRef}
        triggerOnce={true}
        onChange={this.onVisibilityChange}
        as={ProjectWrapper}
        mb={['40px', null, '50px', '70px']}
        px={[null, null, 3, '28px']}
        {...columns}
      >
        <Box
          as={ProjectPreviewItem}
          delay={delay instanceof ResponsiveProp ? delay.getValue() : delay}
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
                {imageHover && !videoPreview && <Img fade={false} fluid={imageHover.fluid} objectFit="cover" objectPosition="center center" style={{ width: `100%`, height: `100%` }} />}
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

            <Flex as={`footer`} flexDirection="column" alignItems="start" px={['5vw', null, 0]}>
              <Text as={'h3'} className={`fw-300 is-sans is-relative`} fontSize={[3, 2, 2, `28px`]} m={[0]}>
                {name}
                <Box as={ProjectTitleUnderline} initialPose="fold" pose={hover ? 'unfold' : 'fold' } aria-hidden="true"></Box>
              </Text>
              {category && (
                <Text as={`h4`} className={`fw-300 is-serif is-gray`} fontSize={[2, 2, 2, `19px`]} m={0}>
                  {category[0].title}
                </Text>
              )}
            </Flex>

          </TransitionLinkComponent>
        </Box>
      </InView>
    )
  }
}

export default ProjectPreview
