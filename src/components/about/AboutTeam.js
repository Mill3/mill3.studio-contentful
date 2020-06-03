import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'

import PersonPreview from '@components/persons/PersonPreview'

import { HORIZONTAL_SPACER } from '@components/content_rows'
import { AboutSectionContainer, AboutSectionHeading } from './index'

const AboutTeam = ({ data, color }) => {
  const { teamIntro, teamMembers } = data

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
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
        <Box as={TeamGrid} flexWrap={['wrap', null, `no-wrap`]} width={[`100%`]}>
          {teamMembers.map(teamMember => (
            <Box
              key={teamMember.id}
              width={[1]}
              // px={[2, null, null, null, 4]}
              mb={[3, null, 0]}
            >
              <PersonPreview person={teamMember} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default AboutTeam

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 4vw;
  /* grid-column-gap: ${props => props.theme.space[4]}px; */
`