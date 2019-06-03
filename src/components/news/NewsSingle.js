import React from 'react'
import { graphql } from 'gatsby'

import ContentRow from '@components/content_rows'
import Layout from '@components/layout'
import Container from '@styles/Container'


const NewsSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <Container>
          <h1>{data.contentfulNews.title}</h1>
          <hr/>
          <ContentRow data={data.contentfulNews.contentRows} />
      </Container>
    </Layout>
  );
}

export default NewsSingle;

export const newsQuery = graphql`
  query newsQuery($id: String!) {
    contentfulNews(id: { eq: $id }) {
      id
      slug
      node_locale
      title
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
