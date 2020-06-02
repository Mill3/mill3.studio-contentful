import React from 'react'
import { Box, Heading } from 'rebass'

import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'

const AboutProcess = ({ data, color }) => {
  const { processIntro, processes } = data
  // console.log('data:', data)

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
      <Box>
        {processes.map((process, i) => (<Box key={i}>{process.title}</Box>))}
      </Box>
      }

    </Box>
  )
}

export default AboutProcess
