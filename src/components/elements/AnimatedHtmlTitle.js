import React from 'react';
import SplitText from 'react-pose-text'
import { charPoses } from '@components/header/HeaderIntro'
import { useInView } from 'react-intersection-observer'

let HTML_PARSER;

export const AnimatedHtmlTitle = ({ source, startDelay }) => {
  // require once
  if( !HTML_PARSER ) HTML_PARSER = require('html-parse-stringify')

  const [ref, inView] = useInView({ threshold: 1, triggerOnce: true })
  const parts = HTML_PARSER.parse(source)

  let delay = startDelay || 250

  const build = () => {
    return parts.map((part, i) => {
      const { children, name } = part
      const Tag = name
      const text = (children[0].children ? children[0].children : children).map(c => c.content).join(' ')
      const d = delay

      delay += text.length * 30

      return (
        <Tag key={i}>
          <SplitText
            initialPose={`out`}
            pose={inView ? `enter` : `out`}
            startDelay={inView ? d : 0}
            charPoses={charPoses}
          >
            {text}
          </SplitText>
        </Tag>
      )
    })
  }

  return <span ref={ref}>{build()}</span>
}

export default AnimatedHtmlTitle
