import React, { Component, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import { InView } from 'react-intersection-observer'
import { debounce } from 'lodash'

import { breakpoints } from '@styles/Theme'
import { HAS_HOVER } from '@utils/constants'
import FigureBox from '@utils/FigureBox'
import ResponsiveProp from '@utils/ResponsiveProp'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import TransitionContainer from '@components/transitions/TransitionContainer'
import Viewport from '@utils/Viewport'

const DEFAULT_COLUMN = {
  width: 1 / 2,
  ml: [0],
  mr: [0],
}

const ProjectPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 500,
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


class ParallaxBox extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  static propTypes = {
    active: PropTypes.bool,
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
  }
  static defaultProps = {
    active: false,
    offset: 0,
  }

  constructor(props) {
    super(props)

    this.state = {
      percentage: 0,
    }

    this.rect = null
    this.ref = createRef()

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
    this.debouncedOnResize = debounce(this.onResize, 750)
  }

  componentDidMount() {
    if (this.props.offset === 0) return

    this.context.getScrollbar(s => {
      this.scrollbar = s
      this.scrollbar.addListener(this.onScroll)

      Viewport.on(this.debouncedOnResize)
      this.onResize()
    })
  }
  componentWillUnmount() {
    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null

    Viewport.off(this.debouncedOnResize)
  }

  onScroll({ offset }) {
    if( !this.props.active || !this.rect ) return

    if( this.props.offset instanceof ResponsiveProp && this.props.offset.getValue() === 0 ) {
      if (this.state.percentage !== 0) this.setState({ percentage: 0 })
      return
    }

    const h = this.rect.height
    const vh = Viewport.height + h - this.rect.offset
    const y = this.rect.y + h - offset.y
    const dist = y / vh
    const percentage = Math.max(0, Math.min(1, 1 - dist)) // from 0 to 1

    if (this.state.percentage === percentage) return

    this.setState({ percentage })
  }
  onResize() {
    if (!this.ref.current || !this.scrollbar) return

    const offset = this.props.offset instanceof ResponsiveProp ? this.props.offset.getValue() : this.props.offset
    const rect = this.ref.current.getBoundingClientRect()
    const y = rect.y + this.scrollbar.offset.y

    this.rect = {
      y: y,
      height: rect.height + offset,
      offset: Math.max(0, Viewport.height - y),
    }
  }

  render() {
    const { active, offset, children, ...props } = this.props
    const { percentage } = this.state

    let transform

    // only calculate transformations if required
    if (active) {
      const value = offset instanceof ResponsiveProp ? offset.getValue() : offset
      transform = value !== 0 ? { transform: `translate3d(0, ${percentage * value}px, 0)` } : {}
    } else {
      transform = {}
    }

    return (
      <Box
        as="div"
        ref={this.ref}
        style={transform}
        {...props}
      >
        {children}
      </Box>
    )
  }
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
