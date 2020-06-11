import React from 'react'
import posed from 'react-pose'
import { Box, Flex, Text } from 'rebass'
import { useInView } from 'react-intersection-observer'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
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


const TeamMember = ({ teamMember, delay }) => {
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
        delay={delay}
        withParent={false}
      >
        <PersonPreview person={teamMember} />
      </Box>
    </Box>
  )
}


const AboutTeam = ({ data, color }) => {
  const { teamIntro, teamMembers } = data
  const IS_FLEX_ROW = Viewport.mq(`(min-width: ${breakpoints[1]})`)

  return (
    <Box
      as={AboutSectionContainer}
      color={color}
      mb={[6]}
    >
      <AboutSectionHeading heading={'h2'} textAlign="center">
        <AnimatedHtmlTitle startDelay={0} source={teamIntro.title} />
      </AboutSectionHeading>

      {teamIntro.introBlurb && (
        <Box            
          mx={"auto"}
          mt={5}
          mb={[5, null, null, 6, 155]}
          width={[1, null, 1/2, 2/3]}
          maxWidth={[null, null, null, 920]}
          textAlign="center"
        >
          <Text
            fontSize={[null, null, null, 4]}
            fontWeight="300"
            dangerouslySetInnerHTML={{ __html: teamIntro.introBlurb.introBlurb }}
          />
        </Box>
      )}

      {teamMembers && (
        <Flex flexDirection={['column', null, 'row']} mx={[space[2] * -1, null, null, null, -50]}>
          {teamMembers.map((teamMember, index) => (
            <TeamMember
              key={index}
              teamMember={teamMember}
              delay={IS_FLEX_ROW ? index * 125 : 0}
            />
          ))}
        </Flex>
      )}
    </Box>
  )
}

export default AboutTeam
