import { graphql } from "gatsby"

export const query = graphql`
  fragment Project on ContentfulProjects {
    id
    slug
    node_locale
    name
    colorMain
    imageMain {
      fluid(maxWidth: 1800, quality: 85) {
        ...GatsbyContentfulFluid_withWebp_noBase64
      }
    }
    imageHover {
      fluid(maxWidth: 1800, quality: 85) {
        ...GatsbyContentfulFluid_withWebp_noBase64
      }
    }
    videoPreview {
      file {
        url
        fileName
        contentType
      }
    }
    shortDescription {
      shortDescription
    }
  }
`

