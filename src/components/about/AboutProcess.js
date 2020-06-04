import React from 'react'
import { Box } from 'rebass'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'
import AboutEyes from './AboutEyes'
import AboutProcessList from './AboutProcessList'
import AboutProcessIntro from './AboutProcessIntro'

const AboutProcess = ({ data, color }) => {
  const { processIntro, processes } = data

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      py={VERTICAL_SPACER}
      css={{position: 'relative'}}
    >
      <AboutSectionHeading>
        <AnimatedHtmlTitle startDelay={750} source={processIntro.title} />
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