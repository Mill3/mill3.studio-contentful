import React from 'react'
//import styled from 'styled-components'
import { Box, Heading } from 'rebass'

import { VERTICAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'

const AboutServices = ({ data, color }) => {
  const { servicesIntro, services } = data

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      py={VERTICAL_SPACER}
    >
      <AboutSectionHeading>
        <span dangerouslySetInnerHTML={{ __html: servicesIntro.title }}></span>
      </AboutSectionHeading>

      {servicesIntro.introBlurb && (
        <Box py={VERTICAL_SPACER}>
          <Heading dangerouslySetInnerHTML={{ __html: servicesIntro.introBlurb.introBlurb }} />
        </Box>
      )}

      {services &&
      <Box>
        {services.map((service, i) => (<Box key={i}>{service.title}</Box>))}
      </Box>
      }

    </Box>
  )
}

export default AboutServices
