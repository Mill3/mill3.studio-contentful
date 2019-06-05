import React from 'react'
import { graphql } from 'gatsby'
import { Text } from 'rebass'
import styled from 'styled-components'

import ContentRow from '@components/content_rows'
import Layout from '@components/layout'
import Container from '@styles/Container'
import SingleHeader from '@components/elements/SingleHeader'

const TitleStyle = styled.h1`
  line-height: 1.1;
`


const NewsSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <Container>
        <SingleHeader
          label="Words words words:"
          title={data.news.title}
          subHeading={data.news.subHeading.subHeading}
          media={data.news.headerMedia}
        />
        {/* <Text as={TitleStyle} className={`is-serif fw-400 is-center`} fontSize={[5, 4, 5, '3.611111111vw']} mb={5}>{data.news.title}</Text> */}
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
