import React from 'react'
import { graphql } from 'gatsby'

import ContentRow from '@components/content_rows'
import Layout from '@components/layout'
import Container from '@styles/Container'
import SingleHeader from '@components/elements/SingleHeader'


const NewsSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <Container>
        <SingleHeader
          label="Words words words:"
          title={data.news.title}
          subHeading={data.news.subHeading ? data.news.subHeading.subHeading : null}
          media={data.news.headerMedia}
        />
        <ContentRow data={data.news.contentRows} />
      </Container>
    </Layout>
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
