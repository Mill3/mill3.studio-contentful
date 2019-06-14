import React from 'react'
import styled, { keyframes } from 'styled-components'
import posed from 'react-pose'
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
  color: ${props => props.theme.colors.black};
`

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

const frames = Array(20).fill(0).map((value, index, arr) => {
  const half = (arr.length - 1) * 0.5
  const duration = half * 0.65
  const scaleRatio = 0.68

  const percentage = index * 2
  const distance = Math.abs(index - half)
  const maximum = Math.max(1, half / duration * scaleRatio)
  const scale = maximum / Math.max(1, distance / duration * scaleRatio)
  const x = index === 0 || index === arr.length - 1 ? 0 : ( index % 2 === 1 ? 0.015 : -0.015 )

  return `${percentage}% { transform: scale(${scale}) translate3d(${x}em, 0, 0); }`
})

const PhoneAnimation = keyframes`
  ${frames.join('')}
`
const PhoneCall = styled.a`
  position: relative;
  display: inline-block;
  line-height: 1;
  color: ${props => props.theme.colors.black} !important;
  transform-origin: center center;
  transform: scale(1) translate3d(0, 0, 0);

  &:hover {
    animation: ${PhoneAnimation} 3000ms infinite;
  }
`
const PhoneCallUnderlinePoses = posed.span({
  exit: {
    scaleX: 0,
  },
  enter: {
    scaleX: 1,
    delay: ({ delay = 0 }) => 500 + delay,
    transition: {
      scaleX: {
        type: 'spring',
      },
    },
  },
})
const PhoneCallUnderline = styled(PhoneCallUnderlinePoses)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: ${props => props.theme.colors.black};
  transform-origin: top left;
  transform: scaleX(1);
`


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
            <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={1200}>Give us </SplitText>

            <Text as={PhoneCall} href="tel:514-561-1550">
              <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={1350}>a call</SplitText>
              <PhoneCallUnderline initialPose={`exit`} pose={`enter`} delay={1500} aria-hidden="true" />
            </Text>

            <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={2500}>, join our social fun </SplitText>
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
