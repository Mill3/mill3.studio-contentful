import React from 'react'
import Img from "gatsby-image"
import styled from 'styled-components'
import { Box } from 'rebass'

const Grid = styled.div`
  display: grid;
  grid-template: 'a a a a';
  grid-column-gap: 15px;
`


const ContentImages = (props) => {
  return (
    <Box as={Grid} my={[2,3,4]}>
      {props.data.medias.map((image, index) => <Img fade={false} fluid={image.fluid} />)}
    </Box>
  )
}

export default ContentImages;

export const ContentImagesFragement = graphql`
  fragment ContentImagesFragement on ContentfulContentImages {
    medias {
      id
      fluid(maxWidth: 1800, quality: 85) {
        ...GatsbyContentfulFluid_withWebp_noBase64
      }
    }
  }
`
