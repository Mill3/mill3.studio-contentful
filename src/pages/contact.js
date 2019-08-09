import React from 'react'
import { injectIntl } from 'react-intl'
import styled, { keyframes } from 'styled-components'
import posed from 'react-pose'
import { Flex, Box, Text } from 'rebass'
import SplitText from 'react-pose-text'

import SEO from '@components/seo'
import ContactForm from '@components/contact/ContactForm'
import ContactTicker from '@components/contact/ContactTicker'
import Container from '@styles/Container'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { space, header } from '@styles/Theme'

const Header = styled.header`
  position: relative;
  margin-top: -${header.height}px;
  padding-top: ${header.height - space[5]}px;
  height: 74vh;
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

const frames = Array(20)
  .fill(0)
  .map((value, index, arr) => {
    const half = (arr.length - 1) * 0.5
    const duration = half * 0.65
    const scaleRatio = 0.68

    const percentage = index * 2
    const distance = Math.abs(index - half)
    const maximum = Math.max(1, (half / duration) * scaleRatio)
    const scale = maximum / Math.max(1, (distance / duration) * scaleRatio)
    const x = index === 0 || index === arr.length - 1 ? 0 : index % 2 === 1 ? 0.015 : -0.015

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
    scaleX: 0.001,
  },
  enter: {
    scaleX: 0.999,
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
  height: 0.075em;
  background: ${props => props.theme.colors.black};
  transform-origin: top left;
  transform: scaleX(0.999);
`

const About = ({ pageContext, intl }) => (
  <React.Fragment>
    <SEO title="Contact us" translate={true} />

    <Flex alignItems={`center`} as={Header} className="z-negative">
      <Container fluid>
        <Box width={`100%`}>
          <Text
            as={`h2`}
            fontSize={fontSizes}
            lineHeight={[`1.4`, null, `1.2`]}
            className={`is-serif-headings fw-900`}
            textAlign="center"
            m={0}
            mb={2}
          >
            <TransitionContainer direction="out">
              <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses}>
                {intl.formatMessage({ id: 'contact.ContactIntroPart1' }).toString()}
              </SplitText>
            </TransitionContainer>
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
            <TransitionContainer direction="out">
              <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={1200}>
                {intl.formatMessage({ id: 'contact.ContactIntroPart2' }).toString()}
              </SplitText>
              {/* <span>&nbsp;</span> */}
              <Text as={PhoneCall} href="tel:514-561-1550">
                <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={1350}>
                  {intl.formatMessage({ id: 'contact.ContactIntroPart3' }).toString()}
                </SplitText>
                <PhoneCallUnderline initialPose={`exit`} pose={`enter`} delay={2500} aria-hidden="true" />
              </Text>

              <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={1500}>
                {intl.formatMessage({ id: 'contact.ContactIntroPart4' }).toString()}
              </SplitText>
              <span>&nbsp;</span>
              <SplitText initialPose={`exit`} pose={`enter`} wordPoses={wordPoses} delay={1800}>
                {intl.formatMessage({ id: 'contact.ContactIntroPart5' }).toString()}
              </SplitText>
            </TransitionContainer>
          </Text>
        </Box>
      </Container>
    </Flex>

    <ContactForm snapIcon={false} />
    <ContactTicker />
  </React.Fragment>
)

export default injectIntl(About)
