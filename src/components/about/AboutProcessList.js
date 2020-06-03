import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import { InView, useInView } from 'react-intersection-observer'
// import { debounce } from 'lodash'
// import { isBrowser } from 'react-device-detect'
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
      inView: false,
      monitorScroll: false,
    }
    this.frame = 0;
    this.scrollbar = null
    this.mounted = false
    this.items = []
    this.itemsRefs = []
    this.processesContainerRef = React.createRef()
    this.animationRef = React.createRef()
    this.onScroll = this.onScroll.bind(this)
    // this.debounced = debounce(() => this.setState({ monitorScroll: true }), 1000)
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
  }

  onScroll() {
    if (!this.state.inView) return

    this._setActiveItemObserver();
    this._setAnimation();
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
    const { direction } = this.scrollbar;
    const duration = current.getDuration()
    const totalFrames = duration * 30

    // stop here if current frame is over max total frames
    if(this.frame >= totalFrames) return;

    // increment frame based on scroll direction
    if (direction == `down`) {
      this.frame = this.frame < totalFrames ? this.frame += 1 : totalFrames
    } else {
      this.frame = this.frame > 1 ? this.frame -= 1 : 1;
    }

    // go to frame
    current.goToAndStop(this.frame, true);
  }

  list(processes) {
    this.items = []
    processes.forEach((process, i) => {
      this.items.push(
        <Flex
          ref={this.itemsRefs[i]}
          as={ProcessItem}
          px={6}
          active={this.state.activeItem === i}
          first={i == processes.length - 1}
          last={i == processes.length - 1}
        >
          <Heading as={ProcessHeading} mr={[0, null, 6]} width={(`100%`, null, '30%')}>
            {process.title}
          </Heading>
          <Box
            as="p"
            width={(`100%`, null, '45%')}
            dangerouslySetInnerHTML={{ __html: process.text.text }}
          />
        </Flex>
      )
    })
    // console.log(this.itemsRefs);
    return this.items
  }

  render() {
    const { processes } = this.props
    console.log(this.state.activeItem);

    return (
      <InView threshold={0.35} onChange={inView => this.setState({ inView: inView })}>
        <Box
          ref={this.processesContainerRef}
          as={ProcessesContainer}
          mt={`-25vh`}
          pt={`50vh`}
        >
          <StickyElement target={this.processesContainerRef.current}>
            <Heading as={ContainerHeading}>0{this.state.activeItem + 1}</Heading>
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

const ContainerHeading = styled(ProcessHeading)`
  position: absolute;
  top: 0;
`

const ProcessItem = styled.article`
  height: ${props => (props.last ? `auto` : `35vh`)};
  transition: opacity 0.25s linear;
  opacity: ${props => (props.active ? 1 : 0.125)};
`
