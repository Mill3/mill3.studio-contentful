import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import posed from 'react-pose'
import { Box } from 'rebass'
import VisibilitySensor from 'react-visibility-sensor'

import EmbeddedPlayer from '@components/player/EmbeddedPlayer'

import { getContentType, CONTENT_TYPES } from '@utils'
import {
  RowContainer,
  VERTICAL_SPACER,
  VERTICAL_ALIGN_VALUES,
  GRID_GUTTER,
  ALIGN_VALUES,
} from './index'

import { Grid } from './ContentImages'

const ContentVideos = ({ data }) => {
  return (
    <RowContainer alignContent={ALIGN_VALUES['center']}>
      <Box
        as={Grid}
        py={VERTICAL_SPACER}
        mt={VERTICAL_SPACER}
        mb={VERTICAL_SPACER}
        itemsPerRow={data.itemsPerRow || 1}
      >
        {data.videos && data.videos.map((video, index) => (
          <>
            {video.embeddedCode && (
              <EmbeddedPlayer
                url={video.embeddedCode.embeddedCode}
                poster={video.videoPoster ? video.videoPoster.file.url : null}
              />
            )}
          </>
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
