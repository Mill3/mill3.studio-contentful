import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import { InView } from 'react-intersection-observer'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import Lottie from 'lottie-react'

import StickyElement from '@utils/StickyElement'
import Viewport from '@utils/Viewport'

import starAnimation from '@animations/star.json'

class AboutProcessList extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeItem: 0,
      lastItemHeight: 0,
      inView: false,
      monitorScroll: false,
    }
    this.frame = 0
    this.scrollbar = null
    this.mounted = false
    this.items = []
    this.itemsRefs = []
    this.processesContainerRef = React.createRef()
    this.animationRef = React.createRef()
    this.currentActiveItemRef = React.createRef()
    this.onResize = this.onResize.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount() {
    this.mounted = true

    // create a ref for each process
    this.props.processes.forEach(process => {
      this.itemsRefs.push(React.createRef())
    })

    this.context.getScrollbar(s => {
      this.scrollbar = s
      if (this.mounted) this.scrollbar.addListener(this.onScroll)
    })

    window.addEventListener('resize', this.onResize);
  }

  componentDidUpdate() {
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onScroll() {
    if (!this.state.inView) return

    this._setActiveItemObserver()
    this._setAnimation()
  }

  onResize() {
    const lastItem = this.itemsRefs[this.itemsRefs.length - 1]

    // stop if not there yet
    if(!lastItem.current) return;

    // get height from last element in list
    const { height } = lastItem.current.getBoundingClientRect();

    // do nothing if height is the same as previously stored
    if(this.state.lastItemHeight == height) return;

    this.setState({
      lastItemHeight: height
    })
  }

  _setActiveItemObserver() {
    const { activeItem } = this.state

    const vh = Viewport.height * 0.5
    const threshold = vh * 0.5
    let distance = null
    let nearestItem = null

    this.itemsRefs.forEach((key, i) => {
      const ref = this.itemsRefs[i]
      if (!ref || !ref.current) return

      const { current } = ref

      const rect = current.getBoundingClientRect()
      const dist = Math.abs(rect.y + rect.height * 0.5 - vh)

      if (dist > threshold) return

      if (distance === null) {
        distance = dist
        nearestItem = i
      } else if (dist < distance) {
        distance = dist
        nearestItem = i
      }
    })

    // if this field is currently active, do nothing
    if (activeItem === nearestItem) return

    // if nearestField is null, do nothing
    if (nearestItem === null) return

    this.setState({
      activeItem: nearestItem,
    })
  }

  _setAnimation() {
    const { current } = this.animationRef
    const { direction } = this.scrollbar
    const duration = current.getDuration()
    const totalFrames = duration * 30
    // TODO: increment value should be based on parent available height
    const incrementFrameBy = 1

    // increment frame based on scroll direction
    if (direction === "down") {
      this.frame = this.frame < totalFrames ? (this.frame += incrementFrameBy) : totalFrames
    } else if(direction === "up") {
      this.frame = this.frame > 1 ? (this.frame -= incrementFrameBy) : 1
    }

    // stop here if current frame is over max total frames
    if (this.frame >= totalFrames) return

    // go to frame
    current.goToAndStop(this.frame, true)
  }

  list(processes) {
    this.items = []
    processes.forEach((process, i) => {
      const active = this.state.activeItem >= i && this.state.inView
      this.items.push(
        <Flex
          ref={this.itemsRefs[i]}
          key={i}
          as={ProcessItem}
          px={6}
          active={active}
          first={i === processes.length - 1}
          last={i === processes.length - 1}
        >
          <Heading as={ProcessHeading} mr={[0, null, 6]} width={(`100%`, null, '30%')}>
            <SplitText
              initialPose={`out`}
              pose={active ? `enter` : `out`}
              startDelay={active ? 250 : 0}
              charPoses={charPoses}
            >
              {process.title}
            </SplitText>
          </Heading>
          <Box as="p" width={(`100%`, null, '45%')} dangerouslySetInnerHTML={{ __html: process.text.text }} />
        </Flex>
      )
    })

    // trigger resize event
    // this.onResize();

    return this.items
  }

  render() {
    const { processes } = this.props

    return (
      <InView threshold={0.15} onChange={inView => this.setState({ inView: inView })}>
        <Box ref={this.processesContainerRef} as={ProcessesContainer} pt={`25vh`} mb={`25vh`}>
          <StickyElement contained={true} target={this.processesContainerRef.current}>
            <Heading ref={this.currentActiveItemRef} as={CurrentActiveItem} active={this.state.inView} height={this.state.lastItemHeight}>
              0{this.state.activeItem + 1}
            </Heading>
            <Lottie autoplay={false} ref={this.animationRef} animationData={starAnimation} />
          </StickyElement>
          <div>{this.list(processes)}</div>
        </Box>
      </InView>
    )
  }
}

export default AboutProcessList

const ProcessesContainer = styled.footer`
  position: relative;
  svg {
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 70px !important;
    height: 70px !important;
  }
`

const ProcessHeading = styled.h4`
  font-size: 52px;
  line-height: 1;
  font-weight: 400;
  text-transform: uppercase;
  margin-top: 0;
`

const CurrentActiveItem = styled(ProcessHeading)`
  position: absolute;
  top: 0;
  display: block;
  transition: opacity 0.25s linear 0.25s;
  opacity: ${props => (props.active ? 1 : 0.125)};
`

const ProcessItem = styled.article`
  height: ${props => (props.last ? `auto` : `35vh`)};
  p {
    transition: opacity 0.25s linear 0.25s;
    opacity: ${props => (props.active ? 1 : 0.125)};
  }
`

const charPoses = {
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex, startDelay }) => startDelay + charIndex * 30,
    transition: {
      y: {
        type: 'spring',
      },
    },
  },
  out: {
    opacity: 0.125,
    y: 5,
    delay: ({ charIndex }) => charIndex * 30,
    transition: {
      y: {
        type: 'spring',
      },
    },
  }
}