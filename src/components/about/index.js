import React from 'react'
import styled from 'styled-components'
import { Box, Heading } from 'rebass'
import TransitionContainer from '@components/transitions/TransitionContainer'
import SplitText from 'react-pose-text'
import { charPoses } from '@components/header/HeaderIntro'
import { useInView } from 'react-intersection-observer'

export const AboutSectionHeading = props => {
  const { heading, children } = props

  return (
    <TransitionContainer>
      <Heading as={heading || `h2`} fontFamily="serif" {...props}>
        <Box as={HeadingStyleInner} fontSize={['clamp(28px, calc(4vw + 28px), 120px)']}>
          {children}
        </Box>
      </Heading>
    </TransitionContainer>
  )
}

export const AnimatedTitle = ({ source, startDelay }) => {
  const HTML = require('html-parse-stringify')
  const [ref, inView] = useInView({ threshold: 1, triggerOnce: true })
  const parts = HTML.parse(source)
  let elements = []

  const build = () => {
    parts.forEach((part, i) => {
      const Tag = part.name
      elements.push(
        <Tag key={i}>
          <SplitText
            initialPose={`out`}
            pose={inView ? `enter` : `out`}
            startDelay={inView ? startDelay || 250 : 0}
            charPoses={charPoses}
          >
            {part.children[0].children
              ? part.children[0].children.map(c => c.content).join(' ')
              : part.children.map(c => c.content).join(' ')}
          </SplitText>
        </Tag>
      )
    })

    return elements
  }

  return <span ref={ref}>{build()}</span>
}

export const AboutSectionContainer = styled.section`
  min-height: 85vh;
`

export const HeadingStyleInner = styled.span`
  line-height: 1.125;
  font-weight: 300;
  strong {
    font-family: ${props => props.theme.fonts.sans};
    font-style: normal;
    font-weight: 500;
  }
`
