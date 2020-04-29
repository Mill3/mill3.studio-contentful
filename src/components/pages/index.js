import { graphql } from "gatsby"

export const query = graphql`
  fragment PageSingle on ContentfulPages {
    id
    slug
    node_locale
    seo {
      ...seoFragment
    }
    contentRows {
      __typename
      ... on ContentfulContentSectionBreak {
        ...ContentSectionBreakFragement
      }
      ... on ContentfulContentText {
        ...ContentTextFragement
      }
      ... on ContentfulContentImages {
        ...ContentImagesFragement
      }
      ... on ContentfulContentForm {
        ...ContentFormFragement
      }
      ... on ContentfulContentSpacer {
        ...ContentSpacerFragement
      }
    }
  }
`
