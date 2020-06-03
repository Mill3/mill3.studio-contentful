import React, { useRef } from 'react'
import styled from 'styled-components';
import { Flex, Box, Heading } from 'rebass'

import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'
import AboutProcessList from './AboutProcessList'
import AboutProcessIntro from './AboutProcessIntro'
import StickyElement from '@utils/StickyElement'

const AboutProcess = ({ data, color }) => {
  const { processIntro, processes } = data
  const processesContainerRef = useRef();

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      // px={HORIZONTAL_SPACER}
      py={VERTICAL_SPACER}
    >
      <AboutSectionHeading>
        <span dangerouslySetInnerHTML={{ __html: processIntro.title }}></span>
      </AboutSectionHeading>

      {processIntro.introBlurb && (
        <AboutProcessIntro text={processIntro.introBlurb.introBlurb} />
      )}

      {processes &&
        <AboutProcessList processes={processes} />
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