import React from 'react'
import { graphql } from 'gatsby'
import { Box } from 'rebass'

import EmbeddedPlayer from '@components/player/EmbeddedPlayer'

import {
  RowContainer,
  Grid,
  VERTICAL_SPACER,
  ALIGN_VALUES,
} from './index'

const ContentVideos = ({ data }) => {
  return (
    <RowContainer alignContent={ALIGN_VALUES['center']}>
      <Box
        as={Grid}
        // mt={VERTICAL_SPACER}
        mb={VERTICAL_SPACER}
        itemsPerRow={data.itemsPerRow || 1}
      >
        {data.videos && data.videos.map((video, index) => (
          <React.Fragment key={index}>
            {video.embeddedCode && (
              <EmbeddedPlayer
                key={index}
                url={video.embeddedCode.embeddedCode || video.embeddedCode}
                poster={video.videoPoster ? video.videoPoster.file.url : null}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    </RowContainer>
  )
}

export default ContentVideos

export const ContentVideoFragement = graphql`
  fragment ContentVideosFragement on ContentfulContentVideos {
    id
    itemsPerRow
    videos {
      id
      title
      videoPoster {
        file {
          url
        }
      }
      video {
        file {
          url
          contentType
        }
      }
      embeddedCode {
        embeddedCode
      }
    }
  }
`
