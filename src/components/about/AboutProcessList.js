import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import { InView } from 'react-intersection-observer'
import SplitText from 'react-pose-text'
import Lottie from 'lottie-react'

import starAnimation from '@animations/star.json'
import { limit } from '@utils/Math'
import StickyElement from '@utils/StickyElement'
import Viewport from '@utils/Viewport'
import { lb2br } from '@utils/Linebreaks'


const ProcessStickyElement = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;

  svg {
    width: 70px !important;
    height: 70px !important;
  }
`
const ProcessHeading = styled.h4`
  text-transform: uppercase;
`
const CurrentActiveItem = styled(ProcessHeading)`
  transition: opacity 0.25s linear 0.25s;
  opacity: ${props => (props.active ? 1 : 0.125)};
`
const ProcessItem = styled.article`
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


class AboutProcessList extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      activeIndex: null,
      inView: false,
    }

    this.activeIndex = null
    this.scrollbar = null
    this.limit = { top: null, bottom: null, height: null }

    this.containerRef = createRef()
    this.animationRef = createRef()

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onVisibilityChange = this.onVisibilityChange.bind(this)
  }

  componentDidMount() {
    this.context.getScrollbar(s => {
      this.scrollbar = s
      this.onResize()
    })

    Viewport.on(this.onResize)
  }
  componentWillUnmount() {
    Viewport.off(this.onResize)
  }

  onScroll({ offset }) {
    const { top, bottom, height } = this.limit

    const distToTop = offset.y - top
    const percentage = limit(0, 1, distToTop / height)
    const index = Math.round( percentage * (this.props.processes.length - 1) )

    // update animation
    const { current } = this.animationRef
    if( current ) {
      const vh = Viewport.height
      const h = bottom - top
      const threshold = h * 0.15
      const inViewPercentage = limit(0, 1, (offset.y - top + vh - threshold) / (h + vh - threshold - vh * 0.6))

      current.goToAndStop( current.getDuration(true) * inViewPercentage >> 0, true )
    }

    // check if value has changed
    if( index === this.activeIndex ) return

    // save new value immediatly to prevent async render mixed with fast scrolling
    this.activeIndex = index

    // update state
    this.setState({ activeIndex: index })
  }
  onResize() {
    if( !this.containerRef.current || !this.scrollbar ) return

    const { top, height } = this.containerRef.current.getBoundingClientRect()

    this.limit.top = top + this.scrollbar.offset.y
    this.limit.bottom = this.limit.top + height
    this.limit.height = height - Viewport.height * 0.60
  }
  onVisibilityChange(inView) {
    if( inView ) this.onResize()
    if( this.scrollbar ) this.scrollbar[inView ? 'addListener' : 'removeListener'](this.onScroll)
    if( this.animationRef.current ) this.animationRef.current[inView ? 'play' : 'pause']()

    this.setState({ inView: inView })
  }

  list(processes) {
    const { activeIndex, inView } = this.state

    return processes.map((process, i) => {
      const active = activeIndex >= i && inView

      return (
        <Flex
          key={i}
          as={ProcessItem}
          px={[0, null, null, '10.763888889vw']}
          height={'35vh'}
          active={active}
        >
          <Heading
            as={ProcessHeading}
            mr={[0, null, null, '6.944444444vw']}
            width={(`100%`, null, null, '22.222222222vw')}
            fontSize={[48, null, null, '3.333333333vw']}
            fontWeight={400}
            lineHeight={1}
          >
            <SplitText
              initialPose={`out`}
              pose={active ? `enter` : `out`}
              startDelay={active ? 250 : 0}
              charPoses={charPoses}
            >
              {process.title}
            </SplitText>
          </Heading>
          <Box as="p" width={(`100%`, null, '45%')} dangerouslySetInnerHTML={{ __html: lb2br(process.text.text) }} />
        </Flex>
      )
    })
  }
  render() {
    const { processes } = this.props
    const { activeIndex, inView } = this.state

    return (
      <InView threshold={0.15} onChange={this.onVisibilityChange}>
        <Box ref={this.containerRef} as={`footer`} pt={`25vh`} css={{position: 'relative'}}>

          <StickyElement
            target={this.containerRef.current}
            as={ProcessStickyElement}
            display="flex"
            justifyContent="space-between"
            width={'100%'}
            height={`${35 + 25}vh`}
            pt={'25vh'}
          >
            <Heading
              ref={this.currentActiveItemRef}
              as={CurrentActiveItem}
              active={inView}
              m={0}
              fontSize={[52, null, null, '3.611111111vw']}
              fontWeight={400}
              lineHeight={[1]}
            >0{activeIndex + 1}</Heading>

            <Lottie
              ref={this.animationRef}
              autoplay={false}
              loop={false}
              animationData={starAnimation}
            />
          </StickyElement>

          <>{this.list(processes)}</>

        </Box>
      </InView>
    )
  }
}

export default AboutProcessList
