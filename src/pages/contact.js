import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import SplitText from 'react-pose-text'

import ContactForm from '@components/contact/ContactForm'
import ContactTicker from '@components/contact/ContactTicker'
import Layout from '@components/layout'
import Container from '@styles/Container'
import { header } from '@styles/Theme'


const Header = styled.header`
  position: relative;
  margin-top: -${header.height}px;
  padding-top: ${header.height}px;
  height: 70vh;
`

/*
const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => 500 + charIndex * 30,
    transition: {
      y: {
        type: 'spring',
      },
    },
  },
}
*/
const wordPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ wordIndex, delay = 0 }) => 500 + wordIndex * 75 + delay,
    transition: {
      y: {
        type: 'spring',
      },
    },
  },
}

const fontSizes = ['6.763285024vw', null, '6.2vw', '3.611111111vw']

/*
const About = ({ pageContext }) => (
  <Layout locale={pageContext.locale}>

    <Flex
      alignItems={`center`}
      as={Header}
      className="z-negative"
    >
      <Container fluid>

        <Box width={`100%`}>
          <Text
            as={`h2`}
            fontSize={fontSizes}
            lineHeight={[`1.4`, null, `1.2`]}
            className={`is-serif fw-300`}
            textAlign="center"
            m={0}
            mb={2}
          >
            <SplitText
              initialPose={`exit`}
              pose={`enter`}
              charPoses={charPoses}
            >
              We would love to talk.
            </SplitText>
          </Text>

          <Text
            as={`h2`}
            fontSize={fontSizes}
            width={[`85%`, null, `90%`, `65%`]}
            lineHeight={[`1.1`, null, `1.2`]}
            className={`is-sans is-normal`}
            textAlign="center"
            m={'0 auto'}
          >
            <SplitText
              initialPose={`exit`}
              pose={`enter`}
              charPoses={charPoses}
            >
              Give us a call, join our social fun or, fill out the form below.
            </SplitText>
          </Text>
        </Box>

      </Container>
    </Flex>

    <ContactForm />
    <ContactTicker />
  </Layout>
);
*/

const About = ({ pageContext }) => (
  <Layout locale={pageContext.locale}>

    <Flex
      alignItems={`center`}
      as={Header}
      className="z-negative"
    >
      <Container fluid>

        <Box width={`100%`}>
          <Text
            as={`h2`}
            fontSize={fontSizes}
            lineHeight={[`1.4`, null, `1.2`]}
            className={`is-serif fw-300`}
            textAlign="center"
            m={0}
            mb={2}
          >
            <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses}>
              We would love to talk.
            </SplitText>
          </Text>

          <Text
            as={`h2`}
            fontSize={fontSizes}
            width={[`85%`, null, `90%`, `65%`]}
            lineHeight={[`1.1`, null, `1.2`]}
            className={`is-sans is-normal`}
            textAlign="center"
            m={'0 auto'}
          >
            <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={1200}>Give us a call, </SplitText>
            <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={2500}>join our social fun </SplitText>
            <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={3800}>or, fill out the form below.</SplitText>
          </Text>
        </Box>

      </Container>
    </Flex>

    <ContactForm />
    <ContactTicker />
  </Layout>
);

export default About
