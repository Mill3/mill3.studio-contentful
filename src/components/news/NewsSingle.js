import React, { useEffect }  from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import ContentRow from '@components/content_rows'
import Container from '@styles/Container'
import SingleHeader from '@components/elements/SingleHeader'
import SEO from '@components/seo'

const NewsSingle = ({ pageContext, data }, { layoutState }) => {
  const { news } = data

  useEffect(() => {
    if( layoutState.invertedHeader ) layoutState.setHeaderInverted(false) // eslint-disable-next-line react-hooks/exhaustive-deps
    if( layoutState.invertedBody ) layoutState.setBodyInverted(false) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>

      <SEO
        seo={news.seo}
        locale={pageContext.locale}
        url={`journal/${news.slug}/`}
        title={!news.seo ? news.name : null}
        description={!news.seo ? (news.subHeading ? news.subHeading.subHeading : null) : null}
        image={!news.seo ? (news.headerMedia && news.headerMedia.file ? news.headerMedia.file.url : null) : null}
      />

      <Container fluid>
        <SingleHeader
          label={{
            text: "news.single.label",
            url: "/journal/",
          }}
          title={news.title}
          subHeading={news.subHeading ? news.subHeading.subHeading : null}
          media={news.headerMedia}
        />
      </Container>
      <ContentRow data={news.contentRows} />
    </React.Fragment>
  );
}

NewsSingle.contextTypes = {
  layoutState: PropTypes.object,
}


export default NewsSingle;

export const newsQuery = graphql`
  query newsQuery($id: String!) {
    news : contentfulNews(id: { eq: $id }) {
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
