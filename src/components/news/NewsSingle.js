import React from 'react'
import { graphql } from 'gatsby'

import ContentRow from '@components/content_rows'
import Container from '@styles/Container'
import SingleHeader from '@components/elements/SingleHeader'


const NewsSingle = ({ pageContext, data }) => {
  return (
    <React.Fragment>
      <Container fluid>
        <SingleHeader
          label={{
            text: "news.single.label",
            url: "/journal/",
          }}
          title={data.news.title}
          subHeading={data.news.subHeading ? data.news.subHeading.subHeading : null}
          media={data.news.headerMedia}
        />
      </Container>
      <ContentRow data={data.news.contentRows} />
    </React.Fragment>
  );
}

export default NewsSingle;

export const newsQuery = graphql`
  query newsQuery($id: String!) {
    news : contentfulNews(id: { eq: $id }) {
      id
      slug
      node_locale
      title
      subHeading {
        subHeading
      }
      headerMedia {
        id
        file {
          url
          fileName
          contentType
        }
      }
      contentRows {
        __typename
        ... on ContentfulContentText {
          ...ContentTextFragement
        }
        ... on ContentfulContentImages {
          ...ContentImagesFragement
        }
      }
    }
  }
`
