import React from 'react'
import { Box } from 'rebass'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import Container from '@styles/Container'

import { AboutSectionHeading } from './index'
import AboutEyes from './AboutEyes'
import AboutProcessList from './AboutProcessList'
import AboutProcessIntro from './AboutProcessIntro'

const AboutProcess = ({ data, color = '#000' }) => {
  const { processIntro, processes } = data

  return (
    <Container
      fluid
      color={color}
      pt={[60, null, 80]}
      css={{position: 'relative'}}
    >
      <AboutSectionHeading>
        <AnimatedHtmlTitle startDelay={750} source={processIntro.title} />
      </AboutSectionHeading>

      <Box
        mt={['calc(60px + 1.5vw)', null, 'calc(80px + 1.8vw)', '9.5vw', '8.5vw', '7.5vw']} 
        mr={[24, 4, 0, 60]}
        css={{position: 'absolute', top: 0, right: 0}}
      >
        <AboutEyes color={color} />
      </Box>

      {processIntro.introBlurb && (
        <AboutProcessIntro text={processIntro.introBlurb.introBlurb} color="#000" opacity={color === "#000" ? 1 : 0} />
      )}

      {processes &&
        <AboutProcessList color={color} processes={processes} />
      }

    </Container>
  )
}

export default AboutProcess
