import React from 'react'
import { graphql } from 'gatsby'
import Layout from '@components/layout'
import styled from 'styled-components'
import { Box, Text } from 'rebass'

import Container from '@styles/Container'

import ContentRow from '@components/content_rows'

const ProjectSingleContainer = styled.div`
  min-height: 2000px;
`

const ProjectSingleHeader = styled.header`
  text-align: center;
`

const ProjectIntroVideo = styled.video`
  width: 100%;
  height: 50vh;
  object-fit: cover;
`


const ProjectSingleHeaderMedia = ({ media }) => {

  const type = (contentType) => {

    if (contentType.match('video').index >= 0) {
      return 'video'
    }

    if (contentType.match('image').index >= 0) {
      return 'image'
    }

    // default is null
    return null
  }

  return (
    <Box as="header" mb={[3,4,5]}>
      {/* video type */}
      {type(media.file.contentType) === 'video' &&
        <ProjectIntroVideo autoPlay playsInline muted>
          <source src={media.file.url} type={media.file.contentType} />
        </ProjectIntroVideo>
      }
      {/* video type */}
      {type(media.file.contentType) === 'image' &&
        <div>image object please</div>
      }
    </Box>
  )
}

const ProjectSingle = ({ pageContext, data }) => {

  return (
    <Layout locale={pageContext.locale}>
      <Container>
        <ProjectSingleContainer>

          {/* video or image */}
          <ProjectSingleHeaderMedia media={data.project.headerMedia} />

          {/* title and subheading */}
          <Box as={ProjectSingleHeader} mb={[2,3,4]} px={[0,4,6]}>

            <Text width={`100%`} as={`h2`} fontSize={[3,4,`4vw`]}>{data.project.name}</Text>

            {data.project.subHeading.subHeading &&
              <Text width={`100%`} as={`h4`} fontSize={[2,3,`2vw`]} >{data.project.subHeading.subHeading}!!</Text>
            }

          </Box>

          <ContentRow data={data.project.contentRows} />
        </ProjectSingleContainer>
      </Container>
    </Layout>
  );
}

export default ProjectSingle;

export const projectQuery = graphql`
  query projectQuery($id: String!) {
    project : contentfulProjects(id: { eq: $id }) {
      id
      slug
      node_locale
      name
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
      }
    }
  }
`
