import React, { useRef } from 'react'
import styled from 'styled-components';
import { Box } from 'rebass'

import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'
import AboutEyes from './AboutEyes'
import AboutProcessList from './AboutProcessList'
import AboutProcessIntro from './AboutProcessIntro'


const AboutProcess = ({ data, color }) => {
  const { processIntro, processes } = data
  const processesContainerRef = useRef();

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      py={VERTICAL_SPACER}
      css={{position: 'relative'}}
    >
      <AboutSectionHeading>
        <span dangerouslySetInnerHTML={{ __html: processIntro.title }}></span>
      </AboutSectionHeading>

      <Box mt={VERTICAL_SPACER} css={{position: 'absolute', top: 0, right: 0}}>
        <AboutEyes color={color} />
      </Box>

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
