import React, { useContext } from 'react'
import posed from 'react-pose'
import { Box, Flex, Text } from 'rebass'
import { useInView } from 'react-intersection-observer'

import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import PersonPreview from '@components/persons/PersonPreview'
import { LayoutContext } from '@layouts/layoutContext'
import Container from '@styles/Container'
import { breakpoints, space } from '@styles/Theme'
import { TRANSITION_INTRO_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'
import Viewport from '@utils/Viewport'
import { AboutSectionHeading } from './index'

const TeamMemberPoses = posed.div({
  hidden: {
    opacity: 0,
    y: 150,
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
const BlurbPoses = posed.div({
  init: {
    opacity: 0,
    y: 50,
  },
  appear: {
    opacity: 1,
    y: 0,
    delay: ({delay}) => delay,
    transition: {
      opacity: { duration: 400, easing: 'linear' },
      y: {
        type: 'spring',
        stiffness: 60,
        damping: 8,
      },
    },
  },
})


const TeamMember = ({ teamMember, delay }) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <Box
      ref={ref}
      width={[1, null, 1/3]}
      px={[2, null, '2.5vw', null, 50]}
      mb={[60, null, 0]}
    >
      <Box
        as={TeamMemberPoses}
        initialPose="hidden"
        pose={inView ? "visible" : "hidden"}
        delay={delay}
        withParent={false}
        css={{transformOrigin: 'top center'}}
      >
        <PersonPreview person={teamMember} />
      </Box>
    </Box>
  )
}


const AboutTeam = ({ data, color = "#000" }) => {
  const { layoutState } = useContext(LayoutContext)
  const { transition } = layoutState
  const { teamIntro, teamMembers } = data

  const IS_FLEX_ROW = Viewport.mq(`(min-width: ${breakpoints[1]})`)
  const delay = transition.state === `intro` ? TRANSITION_INTRO_DELAY : TRANSITION_IN_DELAY

  return (
    <Container fluid mb={[0, null, 5, 6]}>
      <AboutSectionHeading heading={'h2'} textAlign="center" color="#fff">
        <AnimatedHtmlTitle startDelay={delay} source={teamIntro.title} />
      </AboutSectionHeading>

      {teamIntro.introBlurb && (
        <Box
          as={BlurbPoses}
          mx={"auto"}
          mt={[40, null, 5]}
          width={[1]}
          maxWidth={[null, null, '80vw', '73vw', '56vw']}
          textAlign={["left", null, "center"]}
          color="#fff"
          initialPose="init"
          pose="appear"
          delay={delay + 1250}
          withParent={false}
        >
          <Text
            fontSize={['4.830917874vw', null, '3.125vw', '2.419354839vw', '1.666666667vw']}
            fontWeight="300"
            lineHeight={[1.5, null, 1.583333333]}
            dangerouslySetInnerHTML={{ __html: teamIntro.introBlurb.introBlurb }}
          />
        </Box>
      )}

      {teamMembers && (
        <Flex
          color={color}
          flexDirection={['column', null, 'row']}
          mt={[60, null, null, 90, 155]}
          mx={[space[2] * -1, null, '-2.5vw', null, -50]}
        >
          {teamMembers.map((teamMember, index) => (
            <TeamMember
              key={index}
              teamMember={teamMember}
              delay={IS_FLEX_ROW ? index * 250 : 0}
            />
          ))}
        </Flex>
      )}
    </Container>
  )
}

export default AboutTeam
