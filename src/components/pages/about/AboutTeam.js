import React from 'react'
import { Flex, Box } from 'rebass'

import PersonPreview from '@components/persons/PersonPreview'

import { HORIZONTAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'

const AboutTeam = ({ data, color }) => {
  const { teamIntro, teamMembers } = data

  return (
    <Flex
      as={AboutSectionContainer}
      color={color}
      flexDirection="column"
      justifyContent="start"
      alignItems="center"
      px={HORIZONTAL_SPACER}
    >
      <AboutSectionHeading heading={'h2'} textAlign="center">
        <span dangerouslySetInnerHTML={{ __html: teamIntro.title }}></span>
      </AboutSectionHeading>
      {teamIntro.introBlurb && (
        <Box py={5} px={[null, null, null, `14vw`, `18vw`]} textAlign="center">
          <p dangerouslySetInnerHTML={{ __html: teamIntro.introBlurb.introBlurb }}></p>
        </Box>
      )}
      {teamMembers && (
        <Flex flexWrap={['wrap', null, `no-wrap`]} width={[1]}>
          {teamMembers.map(teamMember => (
            <Box
              key={teamMember.id}
              width={[1, null, 1 / 3]}
              px={[2, null, null, null, 4]}
              mb={[3, null, 0]}
            >
              <PersonPreview person={teamMember} />
            </Box>
          ))}
        </Flex>
      )}
    </Flex>
  )
}

export default AboutTeam
