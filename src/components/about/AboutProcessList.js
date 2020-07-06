import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading } from 'rebass'
import { useInView } from 'react-intersection-observer'
import SplitText from 'react-pose-text'
import Lottie from 'lottie-react'


import starAnimation from '@animations/star.json'
import { LayoutContext } from '@layouts/layoutContext'
import { limit } from '@utils/Math'
import StickyElement from '@utils/StickyElement'
import Viewport from '@utils/Viewport'
import { lb2br } from '@utils/Linebreaks'


const ProcessStickyElement = styled.div`
  position: relative;
  pointer-events: none;
  z-index: 2;

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    position: absolute;
    top: 0;
    left: 0;
  }
`
const StickyElementBg = styled.div`
  display: block;
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  opacity: ${({visible}) => visible ? 1 : 0};
  transition: opacity 250ms linear;
  will-change: opacity;

  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    display: none;
  }
`
const ProcessHeading = styled.h4`
  text-transform: uppercase;

  & > div > div {
    will-change: opacity, transform;
  }
`
const CurrentActiveItem = styled(ProcessHeading)`
  transition: opacity 0.25s linear 0.25s;
  opacity: ${props => (props.active ? 1 : 0.125)};
`
const ProcessItem = styled.article`
  p {
    transition: opacity 0.25s linear 0.25s;
    opacity: ${props => (props.active ? 1 : 0.125)};
    will-change: opacity;
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



const ListItem = ({ active = false, title = "", text = "" }) => (
  <Flex
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
        {title}
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
      dangerouslySetInnerHTML={{ __html: text }}
    />
  </Flex>
)



const AboutProcessList = ({ color = '#000', processes }) => {
  const containerRef = useRef()
  const animationRef = useRef()
  const scrollbarRef = useRef()
  const boundaries = useRef({ top: 0, bottom: 0, height: 0 })

  const { layoutState } = useContext(LayoutContext)
  const [ activeIndex, setActiveIndex ] = useState(null)
  const [ inViewRef, inView ] = useInView({ threshold: 0.15 })

  const onResize = useCallback(() => {
    const { top, height } = containerRef.current.getBoundingClientRect()

    boundaries.current.top = top + scrollbarRef.current.offset.y
    boundaries.current.bottom = boundaries.current.top + height
    boundaries.current.height = height - Viewport.height * 0.60
  })
  const onScroll = useCallback(({ offset }) => {
    const { top, bottom, height } = boundaries.current

    const distToTop = offset.y - top
    const percentage = limit(0, 1, distToTop / height)
    const index = Math.round( percentage * (processes.length - 1) )

    // update animation
    const { current } = animationRef
    if( current ) {
      const vh = Viewport.height
      const h = bottom - top
      const threshold = h * 0.15
      const inViewPercentage = limit(0, 1, (offset.y - top + vh - threshold) / (h + vh - threshold - vh * 0.6))

      current.goToAndStop( current.getDuration(true) * inViewPercentage >> 0, true )
    }

    // update state
    setActiveIndex(index)
  })

  // triggered only when inView change
  useEffect(() => {
    if( inView ) {
      onResize()
      Viewport.on(onResize)
      scrollbarRef.current?.addListener(onScroll)
      animationRef.current?.play()
    } else {
      Viewport.off(onResize)
      scrollbarRef.current?.removeListener(onScroll)
      animationRef.current?.pause()
    }

    return () => {
      Viewport.off(onResize)
      scrollbarRef.current?.removeListener(onScroll)
    }
  }, [inView])

  // update scrollbarRef
  useEffect(() => {
    scrollbarRef.current = layoutState.scrollbar
  }, [layoutState.scrollbar])


  // Use `useCallback` so we don't recreate the function on each render - Could result in infinite loop
  const setRefs = useCallback((node) => {
    containerRef.current = node
    inViewRef(node)
  }, [inViewRef])

  const getStickyTargetRef = useCallback(() => {
    return containerRef.current
  }, [inViewRef])


  return (
    <Box ref={setRefs} as={`footer`} pt={[0, null, null, `25vh`]} color="#000" css={{position: 'relative'}}>

      <StickyElement
        target={getStickyTargetRef()}
        as={ProcessStickyElement}
        display="flex"
        alignItems={["center", null, null, "flex-start"]}
        justifyContent="space-between"
        width={'100%'}
        height={['auto', null, null, `${45 + 25}vh`, `${35 + 25}vh`]}
        pt={[4, null, null, '25vh']}
        pb={[4, null, null, 0]}
      >
        <Box as={StickyElementBg} bg="black" visible={color === '#fff'} />
        <Box as={StickyElementBg} bg="white" visible={color === '#000'} />

        <Heading
          as={CurrentActiveItem}
          active={inView}
          m={0}
          fontSize={['9.661835749vw', null, '6.770833333vw', '5.241935484vw', '3.611111111vw']}
          fontWeight={400}
          lineHeight={[1.2, null, 1.192307692]}
        >0{activeIndex + 1}</Heading>

        <Box width={['16.90821256vw', null, '9.114583333vw', '7.056451613vw', `5vw`]}>
          <Lottie ref={animationRef} autoplay={false} loop={false} animationData={starAnimation} />
        </Box>
      </StickyElement>

      <Box css={{zIndex: 0}}>
        {processes && processes.map((process, i) => 
          <ListItem key={i} title={process.title} text={lb2br(process.text.text)} active={activeIndex >= i && inView} />
        )}
      </Box>

    </Box>
  )
}

export default AboutProcessList
