import React from 'react'
import { graphql } from 'gatsby'
import posed from 'react-pose'
import { Box, Text } from 'rebass'
import { useInView } from 'react-intersection-observer'

import { EASES } from '@utils/constants'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { postBody, format, TextColumn } from './ContentText'
import { RowContainer, VERTICAL_SPACER } from './index'
import { TRANSITION_IN_DELAY } from '@utils/constants'

const fontSizes = [5, 4, 5, '3.611111111vw']

const ContentSectionBreak = ({ data, isFirst, isLast }) => {
  return (
    <RowContainer>
      <Box as="header" className="is-center" pt={(isFirst) ? [0] : [4, 4, 4, 6]} px={[4, 3, 0]}>
        {data.title && (
          <TransitionContainer index={0.5}>
            <Text
              as={`h1`}
              fontSize={fontSizes}
              className="is-serif fw-900"
              mb={[5, 5, 4, 2]}
            >
              {data.title}
            </Text>
          </TransitionContainer>
        )}
        {data.text && (
          <Box
            mb={[4,5]}
            mx="auto"
            width={[1, 1, '90%', '60vw']}
          >
            <TextColumn text={data.text ? format(data.text.text) : []} index={1.5} isFirst={false} margin={[0]} />
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
