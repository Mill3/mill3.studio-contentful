import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'

import ContactForm from '@components/contact/ContactForm'
import Layout from '@components/layout'

import { TRANSITION_DURATION, TRANSITION_EXIT_DURATION } from '@utils/constants'


const HeaderIntroPoses = posed.header({
  init: {
    y: `102vh`,
    marginBottom: 500,
    height: `100vh`,
  },
  entered: {
    y: 0,
    marginBottom: 0,
    height: `70vh`,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION * 3 * 1000,
      },
      marginBottom: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION * 3 * 1000,
      },
      height: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_DURATION * 3 * 1000,
      },
    },
  },
  exiting: {
    y: `-10vh`,
    height: `0vh`,
    transition: {
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
      marginBottom: {
        type: 'tween',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
      height: {
        type: 'tween',
        ease: 'backInOut',
        duration: TRANSITION_EXIT_DURATION * 1000,
      },
    },
  },
})

const Header = styled(HeaderIntroPoses)`
  color: #fff;
  padding-top: 120px;
  top: -120px;
  position: relative;
  background: ${props => props.theme.colors.black};
  h2 {
    margin: 0;
  }
`

const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => TRANSITION_DURATION * 1500 + charIndex * 30,
    transition: {
      y: {
        type: 'spring',
      },
    },
  },
}

const fontSizes = ['6.763285024vw', null, '6.2vw', '3.611111111vw']


const HeaderIntro = injectIntl(({ transitionStatus, intl }) => {
  return (
    <Flex
      alignItems={`center`}
      as={Header}
      initialPose={`init`}
      pose={`entered`}
      className={`z-negative`}
    >
      <Box pl={[`5vw`, `5vw`]} width={`100%`}>
        <Text
          as={`h2`}
          fontSize={fontSizes}
          lineHeight={[`1.4`, null, `1.2`]}
          className={`is-serif fw-200`}
        >
          <SplitText
            initialPose={`exit`}
            pose={
              ['entering', 'entered', 'POP'].includes(transitionStatus)
                ? `enter`
                : `exit`
            }
            charPoses={charPoses}
          >
            {intl.formatMessage({ id: 'We would love to talk.' }).toString()}
          </SplitText>
        </Text>

        <Text
          as={`p`}
          fontSize={fontSizes}
          width={[`85%`, null, `82%`, `60%`]}
          lineHeight={[`1.1`, null, `1.2`]}
          className={`is-sans fw-300`}
        >
          <SplitText
            initialPose={`exit`}
            pose={
              ['entering', 'entered', 'POP'].includes(transitionStatus)
                ? `enter`
                : `exit`
            }
            charPoses={charPoses}
          >
            {intl.formatMessage({ id: 'Give us a call, join our social fun or, fill out the form below.' }).toString()}
          </SplitText>
        </Text>
      </Box>


    </Flex>
  )
});

const About = ({ pageContext }) => (
  <Layout locale={pageContext.locale} withIntro={true} introComponent={HeaderIntro}>
    <ContactForm />
  </Layout>
);

export default About
