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

  svg {
    width: 70px !important;
    height: 70px !important;
  }
`
const StickyElementBg = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: ${({visible}) => visible ? 1 : 0};
  transition: opacity 250ms linear;
  will-change: opacity;
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



const AboutProcessList = ({ color = '#0000', processes }) => {
  const containerRef = useRef()
  const animationRef = useRef()

  const { layoutState } = useContext(LayoutContext)
  const [ activeIndex, setActiveIndex ] = useState(null)
  const [ inViewRef, inView ] = useInView({ threshold: 0.15 })
  const { scrollbar } = layoutState

  // triggered only when inView change
  useEffect(() => {
    const boundaries = {
      top: null, 
      bottom: null, 
      height: null
    }

    const onResize = () => {
      const { top, height } = containerRef.current.getBoundingClientRect()
  
      boundaries.top = top + scrollbar.offset.y
      boundaries.bottom = boundaries.top + height
      boundaries.height = height - Viewport.height * 0.60
    }
    const onScroll = ({ offset }) => {
      const { top, bottom, height } = boundaries
  
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
  
      // check if value has changed, update state
      if( index !== activeIndex ) setActiveIndex(index)
    }


    if( inView ) {
      // remove event listener before adding it to prevent doubling (safety check)
      Viewport.off(onResize)
      Viewport.on(onResize)

      onResize()

      // remove event listener before adding it to prevent doubling (safety check)
      scrollbar?.removeListener(onScroll)
      scrollbar?.addListener(onScroll)

      animationRef.current?.play()
    } else {
      Viewport.off(onResize)
      scrollbar?.removeListener(onScroll)
      animationRef.current?.pause()
    }
    

    return () => {
      Viewport.off(onResize)
      scrollbar?.removeListener(onScroll)
    }
  }, [inView])


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
        <Box as={StickyElementBg} d={['block', null, null, 'none']} bg="black" visible={color === '#fff'} />

        <Heading
          as={CurrentActiveItem}
          active={inView}
          m={0}
          fontSize={['9.661835749vw', null, '6.770833333vw', '5.241935484vw', '3.611111111vw']}
          fontWeight={400}
          lineHeight={[1.2, null, 1.192307692]}
        >0{activeIndex + 1}</Heading>

        <Lottie ref={animationRef} autoplay={false} loop={false} animationData={starAnimation} />
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
