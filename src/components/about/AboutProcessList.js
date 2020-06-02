import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { Flex, Box, Heading } from 'rebass'
import { InView, useInView } from 'react-intersection-observer'
import Lottie from "lottie-react";

import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'
import StickyElement from '@utils/StickyElement'

import starAnimation from "@animations/star.json";

const AboutProcessList = ({ processes }) => {
  const processesContainerRef = useRef();
  const [count, setCount] = useState('01');
  const animationRef = useRef();

  return (
    <Box
      ref={processesContainerRef} as={ProcessesContainer}
      py={4}
      px={HORIZONTAL_SPACER}
    >
      <StickyElement target={processesContainerRef.current}>
        <Heading as={ContainerHeading}>{count}</Heading>
        <Lottie ref={animationRef} animationData={starAnimation} />
      </StickyElement>
      <div>
        {processes.map((process, i) => (
          <InView threshold={i == processes.length - 1 ? 0.7 : 0.35} key={i} onChange={(inView) => inView ? setCount(`0${i + 1}`) : []}>
            <Flex
              as={ProcessItem}
              px={6}
              last={i == processes.length - 1}
            >
                <Heading
                  as={ProcessHeading}
                  mr={[0,null,4]}
                  width={`100%`, null, '30%'}
                >
                  {process.title}
                </Heading>
                <Box
                  as="p"
                  width={`100%`, null, '60%'}
                  dangerouslySetInnerHTML={{ __html: process.text.text }}
                />
            </Flex>
          </InView>
        ))}
      </div>
    </Box>
  )
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
    /* transform: translateY(-30%) translateX(45%) scale(0.45) !important;
    z-index: 100;
    width: 400px !important;
    height: 400px !important; */
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
  height: ${props => props.last ? `35vh` : `70vh`};
`

