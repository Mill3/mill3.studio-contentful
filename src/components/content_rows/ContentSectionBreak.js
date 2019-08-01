import React from 'react'
import { graphql } from 'gatsby'
import posed from 'react-pose'
import { Box, Text } from 'rebass'
import { useInView } from 'react-intersection-observer'

import { EASES } from '@utils/constants'
import { postBody, format, TextColumn } from './ContentText'
import { RowContainer, VERTICAL_SPACER } from './index'
import { TRANSITION_IN_DELAY } from '@utils/constants'

const fontSizes = [5, 4, 5, '3.611111111vw']

export const TitlePoses = posed.h1({
  hidden: {
    opacity: 0,
    y: 85,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: TRANSITION_IN_DELAY,
    transition: EASES['default'],
  },
})


const ContentSectionBreak = ({ data, isFirst, isLast }) => {
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <RowContainer>
      <Box ref={ref} as="header" className="is-center" pt={(isFirst) ? [0] : [4, 4, 4, 6]} px={[4, 3, 0]}>
        {data.title && (
          <Text
            as={TitlePoses}
            initialPose={'hidden'}
            pose={inView ? 'visible' : 'hidden'}
            fontSize={fontSizes}
            className="is-serif fw-900"
            mb={[5, 5, 4, 2]}
          >
            {data.title}
          </Text>
        )}
        {data.text && (
          <Box
            mb={[4,5]}
            mx="auto"
            width={[1, 1, '90%', '60vw']}
          >
            <TextColumn text={data.text ? format(data.text.text) : []} index={0} margin={[0]} />
          </Box>
        )}
      </Box>
    </RowContainer>
  )
}

export default ContentSectionBreak

export const ContentSectionBreakFragement = graphql`
  fragment ContentSectionBreakFragement on ContentfulContentSectionBreak {
    id
    title
    text {
      text
    }
  }
`
