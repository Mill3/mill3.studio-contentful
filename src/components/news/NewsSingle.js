import React from 'react'
import { graphql } from 'gatsby'

import ContentRow from '@components/content_rows'
import Container from '@styles/Container'
import SingleHeader from '@components/elements/SingleHeader'
import SEO from '@components/seo'

const NewsSingle = ({ pageContext, data }) => {
  const { news } = data

  return (
    <React.Fragment>

      <SEO
        seo={news.seo}
        locale={pageContext.language}
        url={`journal/${news.slug}/`}
        title={!news.seo ? news.name : null}
        description={!news.seo ? (news.subHeading ? news.subHeading.subHeading : null) : null}
        // image={!news.seo ? (news.headerMedia && news.headerMedia.file ? news.headerMedia.file.url : null) : null}
      />

      <Container fluid>
        <SingleHeader
          label={{
            text: "news.single.label",
            url: "/journal/",
          }}
          title={news.title}
          subHeading={news.subHeading ? news.subHeading.subHeading : null}
          // media={news.headerMedia}
        />
      </Container>
      <ContentRow data={news.contentRows} />
    </React.Fragment>
  );
}

export default NewsSingle;

export const newsQuery = graphql`
  query newsQuery($slug: String!, $language: String!) {
    news : contentfulNews(slug: { eq: $slug }, node_locale: { eq: $language }) {
      id
      slug
      node_locale
      title
      seo {
        ...seoFragment
      }
      subHeading {
        subHeading
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
