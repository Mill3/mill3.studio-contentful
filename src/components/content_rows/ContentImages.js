import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Box } from 'rebass'

import { getContentType, CONTENT_TYPES } from '@utils'
import { RowContainer, VERTICAL_SPACER, VERTICAL_ALIGN_VALUES, GRID_GUTTER } from './index'

const GridColums = itemsPerRow => {
  // since we join the produced array with a string value,
  // we must add an extra cell to the array producing 1 more grid-column.
  // ie: 4 rows need +1. [empty, empty, empty, empty, empty] joined in a string as "1fr 1fr 1fr fr"
  const rows = parseInt(itemsPerRow) + 1
  return new Array(rows).map((item, index) => index).join('1fr ')
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: ${props => (props.gaplessGrid ? `0px` : `${GRID_GUTTER}px`)};
  align-items: ${props => (props.alignItems ? VERTICAL_ALIGN_VALUES[props.alignItems] : `flex-start`)};

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    grid-template-columns: ${props => GridColums(props.itemsPerRow)};
  }
`

const MediaItemImg = styled.img`
  /* border: 1px solid rebeccapurple; */
`

const MediaItemVideo = styled.video`
  margin: 0;
  width: 100%;
  object-fit: cover;
`

const ContentImages = ({ data }) => {
  return (
    <RowContainer alignContent={data.alignContent}>
      <Box
        as={Grid}
        mb={VERTICAL_SPACER}
        gaplessGrid={data.gaplessGrid}
        itemsPerRow={data.itemsPerRow}
        alignItems={data.alignVertical}
      >
        {data.medias.map((img, index) => (
          <Box as="figure" m="0" key={img.id}>
            {getContentType(img.file.contentType) ===
              CONTENT_TYPES['image'] && (
              <MediaItemImg
                src={img.fluid.src}
                srcSet={img.fluid.srcSet}
                className="img-fluid"
                alt={`${img.description || img.id}`}
              />
            )}

            {getContentType(img.file.contentType) ===
              CONTENT_TYPES['video'] && (
              <MediaItemVideo autoPlay loop playsInline muted>
                <source src={img.file.url} type={img.file.contentType} />
              </MediaItemVideo>
            )}

            {img.description && (
              <Box as={`figcaption`} pt={[2]} pl={[3, 4]} color={'gray'}>
                {img.description}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </RowContainer>
  )
}

export default ContentImages

export const ContentImagesFragement = graphql`
  fragment ContentImagesFragement on ContentfulContentImages {
    itemsPerRow
    alignContent
    alignVertical
    gaplessGrid
    medias {
      id
      description
      file {
        url
        contentType
      }
      fixed(width: 1800, quality: 85) {
        ...GatsbyContentfulFixed_noBase64
      }
      fluid(maxWidth: 1800, quality: 85) {
        ...GatsbyContentfulFluid_withWebp_noBase64
      }
    }
  }
`
