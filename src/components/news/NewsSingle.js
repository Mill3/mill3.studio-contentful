import React from 'react'
import { graphql } from 'gatsby'

import Container from '@styles/Container'
import Layout from '@components/layout'

const NewsSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <Container>
          <h1>{data.contentfulNews.title}</h1>
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
    }
  }
`
