import React from 'react';
import SplitText from 'react-pose-text'
import { charPoses } from '@components/header/HeaderIntro'
import { useInView } from 'react-intersection-observer'

export const AnimatedHtmlTitle = ({ source, startDelay }) => {
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

export default AnimatedHtmlTitle