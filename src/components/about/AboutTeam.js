import React from 'react'
import posed from 'react-pose'
import { Box, Flex } from 'rebass'
import { useInView } from 'react-intersection-observer'

import PersonPreview from '@components/persons/PersonPreview'
import { breakpoints, space } from '@styles/Theme'
import Viewport from '@utils/Viewport'

import { AboutSectionContainer, AboutSectionHeading } from './index'


const TeamMemberPoses = posed.div({
  hidden: {
    opacity: 0,
    y: 500,
    scale: 1.125,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    delay: ({ delay = 0 }) => delay,
    transition: {
      type: 'spring',
      stiffness: 30,
      mass: 0.925,
    },
  }
})


const TeamMember = ({ teamMember, index }) => {
  const IS_FLEX_ROW = Viewport.mq(`(min-width: ${breakpoints[1]})`)
  const [ref, inView] = useInView({ threshold: 0, triggerOnce: true })

  return (
    <Box
      ref={ref}
      width={[1, null, 1/3]}
      px={[2, null, null, null, 50]}
      mb={[3, null, 0]}
    >
      <Box
        as={TeamMemberPoses}
        initialPose="hidden"
        pose={inView ? "visible" : "hidden"}
        delay={IS_FLEX_ROW ? index * 125 : 0}
        withParent={false}
      >
        <PersonPreview person={teamMember} />
      </Box>
    </Box>
  )
}


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
        <Flex flexDirection={['column', null, 'row']} mx={[space[2] * -1, null, null, null, -50]}>
          {teamMembers.map((teamMember, index) => <TeamMember key={index} index={index} teamMember={teamMember} />)}
        </Flex>
      )}
    </Box>
  )
}

export default AboutTeam
