import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import { InView } from 'react-intersection-observer'
import { debounce } from 'lodash'

import FigureBox from '@utils/FigureBox'
import ResponsiveProp from '@utils/ResponsiveProp'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import TransitionContainer from '@components/transitions/TransitionContainer'
import Viewport from '@utils/Viewport'

const NewsPoses = posed.article({
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

const NewsWrapper = styled(Box)`
  &:last-child {
    margin-bottom: 0 !important;
  }
`

const NewsPreviewItem = styled(NewsPoses)`
  figure {
    position: relative;
    overflow: hidden;
  }

  a {
    display: block;
    color: #000;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
`

const ReadMoreStyle = styled.p`
  display: inline-block;
  border-bottom: 1px solid ${props => props.theme.colors.gray};
`

class NewsPreview extends Component {
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
    }

    this.mounted = false
    this.rootRef = React.createRef()

    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
    this.debouncedOnResize = debounce(this.onResize, 750)
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.offset === 0) return

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
  onScroll({ offset }) {
    if (!this.mounted || !this.state.inView || !this.rect) return
    if (this.props.offset instanceof ResponsiveProp && this.props.offset.getValue() === 0) {
      if (this.state.percentage !== 0) this.setState({ percentage: 0 })
      return
    }

    const h = this.rect.height
    const vh = Viewport.height + h - this.rect.offset
    const y = this.rect.y + h - offset.y
    const dist = y / vh
    const percentage = Math.max(0, Math.min(1, 1 - dist)) // from 0 to 1

    if (this.state.percentage === percentage) return

    this.setState({
      percentage,
    })
  }
  onResize() {
    if (!this.rootRef || !this.rootRef.current || !this.rootRef.current.node || !this.scrollbar) return

    const rect = this.rootRef.current.node.getBoundingClientRect()
    const y = rect.y + this.scrollbar.offset.y

    this.rect = {
      y: y,
      height: rect.height,
      offset: Math.max(0, Viewport.height - y),
    }
  }

  render() {
    const { news, delay, columns, offset, index } = this.props
    const { slug, imageMain, title } = news.node
    const { inView, percentage } = this.state
    let transform

    // only calculate transformations if required
    if (inView) {
      const value = offset instanceof ResponsiveProp ? offset.getValue() : offset
      transform = value !== 0 ? { transform: `translate3d(0, ${percentage * value}px, 0)` } : {}
    } else transform = {}

    return (
      <InView
        ref={this.rootRef}
        triggerOnce={true}
        onChange={this.onVisibilityChange}
        as={NewsWrapper}
        px={[2, null, 3, '28px']}
        mb={['40px', null, '70px']}
        {...columns}
      >
        <Box
          as={NewsPreviewItem}
          delay={delay instanceof ResponsiveProp ? delay.getValue() : delay}
          initialPose={'hidden'}
          pose={inView ? 'visible' : 'hidden'}
          width={'100%'}
        >
          <TransitionContainer direction="out" distance={150} index={index}>
            <TransitionLinkComponent to={`/journal/${slug}`} title={title} style={transform}>
              <Box as={`figure`} mb={[4]}>
                <FigureBox ratio={4 / 6}>
                  <Img fade={false} fluid={imageMain.fluid} />
                </FigureBox>
              </Box>
              <Box as={`footer`} width={`70%`}>
                <Text as={`h3`} className={`fw-300 is-sans`} fontSize={[2]} lineHeight={[1.2]} mb={[2]}>
                  {title}
                </Text>
                <Text as={ReadMoreStyle} className={`fw-600 is-serif`} fontSize={[1]} m={0}>
                  Read more
                </Text>
              </Box>
            </TransitionLinkComponent>
          </TransitionContainer>
        </Box>
      </InView>
    )
  }
}

export default NewsPreview
