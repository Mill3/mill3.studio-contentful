import React from 'react'
import { Box, Heading } from 'rebass'

import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'

const AboutClients = ({ data, color }) => {
  const { clientsIntro } = data
  // console.log('data:', data)

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      px={[2,4]}
      py={VERTICAL_SPACER}
    >
      <AboutSectionHeading>
        <span dangerouslySetInnerHTML={{ __html: clientsIntro.title }}></span>
      </AboutSectionHeading>

      {clientsIntro.introBlurb && (
        <Box py={VERTICAL_SPACER}>
          <Heading dangerouslySetInnerHTML={{ __html: clientsIntro.introBlurb.introBlurb }} />
        </Box>
      )}

    </Box>
  )
}

export default AboutClients
