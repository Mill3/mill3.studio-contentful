import React, { useRef } from 'react'
import styled from 'styled-components';
import { Flex, Box, Heading } from 'rebass'

import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'
import StickyElement from '@utils/StickyElement'

const AboutProcess = ({ data, color }) => {
  const { processIntro, processes } = data
  const processesContainerRef = useRef();

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      px={[2,4]}
      py={VERTICAL_SPACER}
    >
      <AboutSectionHeading>
        <span dangerouslySetInnerHTML={{ __html: processIntro.title }}></span>
      </AboutSectionHeading>

      {processIntro.introBlurb && (
        <Box px={HORIZONTAL_SPACER} py={VERTICAL_SPACER} textAlign="center">
          <Heading fontSize={`5vw`} dangerouslySetInnerHTML={{ __html: processIntro.introBlurb.introBlurb }} />
        </Box>
      )}

      {processes &&
      <Box ref={processesContainerRef} as={ProcessesContainer}>
        <StickyElement target={processesContainerRef.current}>
          <Heading>1</Heading>
        </StickyElement>
        <div>
          {processes.map((process, i) => (<Box as={ProcessItem} key={i}>{process.title}</Box>))}
        </div>
      </Box>
      }

    </Box>
  )
}

export default AboutProcess

const ProcessesContainer = styled.footer`
  /* min-height: 200vh; */
  position: relative;
  border: 1px solid rebeccapurple;
`

const ProcessItem = styled.article`
  height: 50vh;
`