import React from 'react'
import styled from 'styled-components'
import { Box, Text } from 'rebass'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import { injectIntl } from 'react-intl'


import { charPoses } from '@components/header/HeaderIntro'
import HomeTitle from '@components/home/HomeTitle'
import Container from '@styles/Container'


export const TitlePoses = posed.h2({
  static: {
    opacity: 1,
  },
  sticky: {
    opacity: 0.075,
  }
})
const TitleStyle = styled(TitlePoses)`
  font-family: ;
  font-size: 156px;
  font-weight: 300;
  margin: 0;
  text-transform: uppercase;
  transform-origin: top center;
`
const EllipseSVG = styled.svg`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: auto;
  transform: translate(-50%, -50%);
`
const Ellipse = posed.ellipse({
  exit: { strokeDasharray: 1460, strokeDashoffset: 1460 },
  enter: {
    strokeDashoffset: 2920,
    delay: ({delay}) => delay,
    duration: ({duration}) => duration,
    easing: 'circOut',
  },
})
const LatestSpan = styled.span`
  position: relative;
  padding-left: 50px;
  padding-right: 50px;

  & > div > div:nth-child(2) {
    margin-right: -0.125em;
  }
`
const ArrowSpan = posed.span({
  exit: { opacity: 0, x: '-50%' },
  enter: {
    opacity: 1,
    x: '0%',
    delay: ({delay}) => delay,
    transition: {
      x: {
        type: 'spring',
      },
    },
  },
  out: {
    opacity: 0,
    x: '50%',
    transition: {
      x: {
        type: 'spring',
      },
    },
  },
})
const WorkSpan = styled.span`
  & > div > div:nth-child(1) {
    margin-right: -0.075em;
  }
`
const LetsSpan = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
`

const StickyTitle = ({ intl, appear, inverted, faded, switchTitle, ...props }) => {
  const latest = intl.formatMessage({ id: 'intro.Latest' })
  const work = intl.formatMessage({ id: 'intro.Work' })
  const lets = intl.formatMessage({ id: 'intro.Lets' })

  return (
    <Container
      fluid
      color={inverted ? "white" : "black"}
      pt={7}
      {...props}
    >
      <Box style={{position: 'relative'}}>
        <HomeTitle style={{visibility: 'hidden', pointerEvents: 'none'}}>{latest} {work}</HomeTitle>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          style={{position: 'absolute', top: 0, left: 0}}
          aria-hidden={true}
        >
          <Text
            as={TitleStyle}
            display="flex"
            fontFamily={'serif'}
            alignItems="center"
            justifyContent="center"
            aria-label={`${switchTitle ? lets : latest} ${work}`}
            initialPose={`static`}
            pose={faded ? `sticky` : `static`}
          >
            <Box as={LatestSpan} className={'is-sans'}>
              <Box as={EllipseSVG} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 625 290.4">
                <Box
                  as={Ellipse}
                  cx="312.5"
                  cy="145.2"
                  rx="308"
                  ry="141"
                  stroke="currentColor"
                  strokeWidth="9"
                  fill="none"
                  initialPose={`exit`}
                  pose={appear ? `enter` : `exit`}
                  duration={(latest + work).length * 30 + 1250}
                ></Box>
              </Box>

              <SplitText
                initialPose={`exit`}
                pose={appear && !switchTitle ? `enter` : `out`}
                startDelay={appear && !switchTitle ? 250 : 0}
                charPoses={charPoses}
              >
                {latest}
              </SplitText>

              <Box as={LetsSpan}>
                <SplitText
                  initialPose={`exit`}
                  pose={switchTitle ? `enter` : `out`}
                  startDelay={switchTitle ? latest.length * 30 : 0}
                  charPoses={charPoses}
                >
                  {lets}
                </SplitText>
              </Box>
            </Box>

            <Box as={ArrowSpan} initialPose={'exit'} pose={appear ? `enter` : null} delay={latest.length * 30 + 350} mx={[4]}>→</Box>

            <Box as={WorkSpan}>
              <SplitText
                initialPose={`exit`}
                pose={appear ? `enter` : `out`}
                startDelay={latest.length * 30 + 450}
                charPoses={charPoses}
              >
                {work}
              </SplitText>
            </Box>
          </Text>
        </Box>
      </Box>
    </Container>
  )
}

export default injectIntl(StickyTitle)
