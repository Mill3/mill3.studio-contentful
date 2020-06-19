import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import { InView } from 'react-intersection-observer'
import SplitText from 'react-pose-text'
import Lottie from 'lottie-react'

import { LayoutContext } from '@layouts/layoutContext'

import starAnimation from '@animations/star.json'
import { limit } from '@utils/Math'
import StickyElement from '@utils/StickyElement'
import Viewport from '@utils/Viewport'
import { lb2br } from '@utils/Linebreaks'


const ProcessStickyElement = styled.div`
  position: relative;
  pointer-events: none;
  z-index: 2;
  transition: background-color 250ms linear;

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    position: absolute;
    top: 0;
    left: 0;
  }

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

  static contextType = LayoutContext

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
    // this.context.getScrollbar(s => {
    //   this.scrollbar = s
    //   this.onResize()
    // })

    Viewport.on(this.onResize)
  }

  componentDidUpdate() {
    if(this.scrollbar) return
    if(this.context.layoutState.scrollbar) {
      this.scrollbar = this.context.layoutState.scrollbar
      this.onResize()
    }
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
          flexDirection={['column', null, null, 'row']}
          px={[0, null, null, '9vw', '10.763888889vw']}
          pt={[0, null, 30, 0]}
          pb={[60, null, 0]}
          height={['auto', null, '35vh', '45vh', '35vh']}
          active={active}
        >
          <Heading
            as={ProcessHeading}
            m={0}
            p={0}
            mr={[0, null, null, '6vw', '6.944444444vw']}
            width={[`100%`, null, null, '32vw', '22.222222222vw']}
            fontSize={['6.280193237vw', null, '6.25vw', '4.838709677vw', '3.333333333vw']}
            fontWeight={400}
            lineHeight={[1.192307692, null, 1.208333333]}
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

          <Box
            as="p"
            width={[`100%`, null, null, '45%']}
            m={0}
            p={0}
            mt={[10, null, null, 0]}
            fontSize={['4.830917874vw', null, '2.604166667vw', '2.016129032vw', '1.388888889vw']}
            lineHeight={[1.5, null, 1.6]}
            dangerouslySetInnerHTML={{ __html: lb2br(process.text.text) }}
          />
        </Flex>
      )
    })
  }
  render() {
    const { color, processes } = this.props
    const { activeIndex, inView } = this.state

    return (
      <InView threshold={0.15} onChange={this.onVisibilityChange}>
        <Box ref={this.containerRef} as={`footer`} pt={[0, null, null, `25vh`]} color="#000" css={{position: 'relative'}}>

          <StickyElement
            target={this.containerRef.current}
            as={ProcessStickyElement}
            display="flex"
            alignItems={["center", null, null, "flex-start"]}
            justifyContent="space-between"
            width={'100%'}
            height={['auto', null, null, `${45 + 25}vh`, `${35 + 25}vh`]}
            pt={[4, null, null, '25vh']}
            pb={[4, null, null, 0]}
            bg={[color === '#000' ? 'white' : 'black', null, null, 'transparent']}
          >
            <Heading
              ref={this.currentActiveItemRef}
              as={CurrentActiveItem}
              active={inView}
              m={0}
              fontSize={['9.661835749vw', null, '6.770833333vw', '5.241935484vw', '3.611111111vw']}
              fontWeight={400}
              lineHeight={[1.2, null, 1.192307692]}
            >0{activeIndex + 1}</Heading>

            <Lottie
              ref={this.animationRef}
              autoplay={false}
              loop={false}
              animationData={starAnimation}
            />
          </StickyElement>

          <Box css={{zIndex: 0}}>
            {this.list(processes)}
          </Box>

        </Box>
      </InView>
    )
  }
}

export default AboutProcessList
