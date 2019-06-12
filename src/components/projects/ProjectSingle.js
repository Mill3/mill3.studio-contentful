import React from 'react'
import { graphql } from 'gatsby'
import { Flex, Box } from 'rebass'

import Layout from '@components/layout'
import Container from '@styles/Container'
import ContentRow from '@components/content_rows'
import SingleHeader from '@components/elements/SingleHeader'
import Button from '@components/buttons'

const ProjectSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      {/* {console.log(data)} */}
      <Container>
        <SingleHeader
          label="Projects:"
          title={data.project.name}
          subHeading={data.project.subHeading ? data.project.subHeading.subHeading : null}
          media={data.project.headerMedia}
        />
      </Container>
      <ContentRow data={data.project.contentRows} />
      {data.project.url &&
      <Flex>
        <Box mx="auto">
          <a href={data.project.url} target="_blank">
            <Button>Visit website</Button>
          </a>
        </Box>
      </Flex>
      }
    </Layout>
  )
}

export default ProjectSingle

export const projectQuery = graphql`
  query projectQuery($id: String!, $locale: String!) {
    project: contentfulProjects(id: { eq: $id }, node_locale : { eq: $locale }) {
      id
      slug
      node_locale
      name
      url
      shortDescription {
        shortDescription
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
        ... on ContentfulContentVideos {
          ...ContentVideosFragement
        }
      }
    }
  }
`
