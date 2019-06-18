import { graphql } from "gatsby"

export const query = graphql`
  fragment Project on ContentfulProjects {
    id
    slug
    node_locale
    name
    colorMain
    category {
      id
      title
    }
    imageMain {
      fixed(width: 1800, quality: 85) {
        ...GatsbyContentfulFixed_withWebp_noBase64
      }
      fluid(maxWidth: 1800, quality: 85) {
        ...GatsbyContentfulFluid_withWebp_noBase64
      }
    }
    imageHover {
      fixed(width: 1800, quality: 85) {
        ...GatsbyContentfulFixed_withWebp_noBase64
      }
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

