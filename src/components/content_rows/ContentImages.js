import React from 'react'
import Img from 'gatsby-image'
import styled from 'styled-components'
import { Box } from 'rebass'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-column-gap: 15px;
`

const ContentImages = props => {
  return (
    <Box as={Grid} mb={[5]}>
      {props.data.medias.map((image, index) => (
        <Img
          fade={true}
          durationFadeIn={2000}
          fluid={image.fluid}
          objectFit="contain"
          key={index}
        />
      ))}
    </Box>
  )
}

export default ContentImages

export const ContentImagesFragement = graphql`
  fragment ContentImagesFragement on ContentfulContentImages {
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
