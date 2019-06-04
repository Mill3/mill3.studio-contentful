import React from 'react'
import { graphql } from 'gatsby'
import { Text } from 'rebass'
import styled from 'styled-components'

import ContentRow from '@components/content_rows'
import Layout from '@components/layout'
import Container from '@styles/Container'

const TitleStyle = styled.h1`
  line-height: 1.1;
`


const NewsSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <Container>
          <Text as={TitleStyle} className={`is-serif fw-400 is-center`} fontSize={[5, 4, 5, '3.611111111vw']} mb={5}>{data.contentfulNews.title}</Text>
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
