import React from 'react'
import styled, { keyframes } from 'styled-components'
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

  & > div > div:nth-child(2) {
    margin-right: -0.125em;
  }
`
const arrowAppear = keyframes`
  to {
    opacity: 1;
    transform: translateX(0%);
  }
`
const arrowSwitchTitle = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%);
  }
  to {
    opacity: 1;
    transform: translateX(0%);
  }
`
const ArrowSpan = styled.span`
  opacity: 0;
  transform: translateX(-50%);

  &.--appear {
    animation-name: ${arrowAppear};
    animation-duration: 850ms;
    animation-delay: ${props => props.delay}ms;
    animation-fill-mode: both;
  }
  &.--switchTitle {
    animation-name: ${arrowSwitchTitle};
    animation-duration: 850ms;
    animation-delay: ${props => props.delay}ms;
    animation-fill-mode: both;
  }
`
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
      pt={[6, null, '170px', 7]}
      pb={[4, null, 2, 0]}
      {...props}
    >
      <Box style={{position: 'relative'}}>
        <HomeTitle style={{visibility: 'hidden', pointerEvents: 'none'}}>{latest} {work}</HomeTitle>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width={'100%'}
          style={{position: 'absolute', top: 0, left: 0}}
          aria-hidden={true}
        >
          <Text
            as={TitleStyle}
            display="flex"
            fontFamily={'serif'}
            fontSize={['9.2vw', null, '10.416666667vw', null, '10.833333333vw']}
            fontWeight={'300'}
            alignItems="center"
            justifyContent="center"
            m={0}
            aria-label={`${switchTitle ? lets : latest} ${work}`}
            initialPose={`static`}
            pose={faded ? `sticky` : `static`}
          >
            <Box as={LatestSpan} px={[3, null, 4, "50px"]} className={'is-sans'}>
              <Box as={EllipseSVG} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 625 290.4">
                <Box
                  as={Ellipse}
                  cx="312.5"
                  cy="145.2"
                  rx="308"
                  ry="141"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  initialPose={`exit`}
                  pose={appear ? `enter` : `exit`}
                  duration={(latest + work).length * 30 + 1250}
                ></Box>
              </Box>

              <SplitText
                initialPose={`out`}
                pose={appear && !switchTitle ? `enter` : (switchTitle ? `leave` : `out`)}
                startDelay={appear && !switchTitle ? 250 : 0}
                charPoses={charPoses}
              >
                {latest}
              </SplitText>

              <Box as={LetsSpan}>
                <SplitText
                  initialPose={`out`}
                  pose={switchTitle ? `enter` : `out`}
                  startDelay={latest.length * 30}
                  charPoses={charPoses}
                >
                  {lets}
                </SplitText>
              </Box>
            </Box>

            <Box
              as={ArrowSpan}
              delay={(switchTitle ? lets : latest).length * 30 + (switchTitle ? 150 : 350)}
              mx={[3, 4]}
              className={appear && !switchTitle ? `--appear` : (switchTitle ? `--switchTitle` : null)}
            >→</Box>

            <Box as={WorkSpan}>
              <SplitText
                initialPose={`out`}
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
