import React from 'react'
// import Img from 'gatsby-image'
import styled from 'styled-components'
import { Box } from 'rebass'

import { RowContainer, VERTICAL_SPACER, GRID_GUTTER } from './index'

const GridColums = itemsPerRow => {
  // since we join the produced array with a string value,
  // we must add an extra cell to the array producing 1 more grid-column.
  // ie: 4 rows need +1. [empty, empty, empty, empty, empty] joined in a string as "1fr 1fr 1fr fr"
  const rows = parseInt(itemsPerRow) + 1
  return new Array(rows).map((item, index) => (index)).join("1fr ")
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: ${props => (props.gaplessGrid ? `0px` : `${GRID_GUTTER}px`)};

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    grid-template-columns: ${props => GridColums(props.itemsPerRow)};
  }
`

const Img = styled.img`
  /* border: 1px solid rebeccapurple; */
`

const ContentImages = ({data}) => {


  return (
    <RowContainer alignContent={data.alignContent}>
      <Box as={Grid} mb={VERTICAL_SPACER} gaplessGrid={data.gaplessGrid} itemsPerRow={data.itemsPerRow}>
        {data.medias.map((img, index) => (
          <figure>
            {/* {console.log(img.fluid)} */}
            <Img
              src={img.fluid.src}
              srcSet={img.fluid.srcSet}
              // fade={true}
              // durationFadeIn={2000}
              // fluid={img.fluid}
              // objectFit="contain"
              className="img-fluid"
              key={index}
            />
          </figure>
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
    gaplessGrid
    medias {
      id
      fixed(width: 1800, quality: 85) {
        ...GatsbyContentfulFixed_noBase64
      }
      fluid(maxWidth: 1800, quality: 85) {
        ...GatsbyContentfulFluid_withWebp_noBase64
      }
    }
  }
`
