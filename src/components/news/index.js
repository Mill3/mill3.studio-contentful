import { graphql } from "gatsby"

export const query = graphql`
  fragment News on ContentfulNews {
    id
    slug
    node_locale
    title
    imageMain {
      fluid(maxWidth: 1800, quality: 85) {
        ...GatsbyContentfulFluid_withWebp_noBase64
      }
    }
  }
`
