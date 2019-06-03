import React from 'react'
import { graphql } from 'gatsby'
import { FormattedMessage, injectIntl } from 'react-intl'
import Layout from '@components/layout'
import styled from 'styled-components'
import { Box, Text } from 'rebass'
import { height } from 'styled-system'

import Container from '@styles/Container'
import ContentRow from '@components/content_rows'

const MediaContainer = styled.header`
  ${height};
`

// TODO: move me in a seperate file!
const ProjectSingleHeaderMedia = ({ media }) => {
  const detectType = contentType => {
    if (contentType.match('video') && contentType.match('video').index >= 0) {
      return 'video'
    }

    if (contentType.match('image') && contentType.match('image').index >= 0) {
      return 'image'
    }

    // default is null
    return null
  }

  return (
    <Box as={MediaContainer} mb={[3, 4, 5]} height={[`80vh`, `80vh`, `65vh`]}>
      {/* video */}
      {detectType(media.file.contentType) === 'video' && (
        <Box as={ProjectIntroVideo} autoPlay playsInline muted>
          <source src={media.file.url} type={media.file.contentType} />
        </Box>
      )}

      {/* image type */}
      {detectType(media.file.contentType) === 'image' && (
        <img src={media.file.url} alt={`heading image`} className="img-fluid" />
      )}
    </Box>
  )
}

const ProjectSingleContainer = styled.div`
  min-height: 2000px;
`

const ProjectSingleHeader = styled.header`
  text-align: center;
`

const ProjectIntroVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ProjectSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <Container>
        <ProjectSingleContainer>
          {/* video or image */}
          <ProjectSingleHeaderMedia media={data.project.headerMedia} />

          {/* title and subheading */}
          <Box as={ProjectSingleHeader} mb={[4, 5]} px={[4, 4, 5]}>
            <Text width={`100%`} as={`h6`} fontSize={[2, 3]} color="blue">
              <FormattedMessage id="Project:" />
            </Text>

            <Text width={`100%`} as={`h2`} fontSize={[5, `6vw`, `4vw`]} mb={0}>
              {data.project.name}
            </Text>

            {data.project.subHeading.subHeading && (
              <Text
                width={`100%`}
                as={`h4`}
                fontSize={[3, 3, `2vw`]}
                pt={[2, 4, 4]}
              >
                {data.project.subHeading.subHeading}!!
              </Text>
            )}
          </Box>

          <ContentRow data={data.project.contentRows} />
        </ProjectSingleContainer>
      </Container>
    </Layout>
  )
}

export default ProjectSingle

export const projectQuery = graphql`
  query projectQuery($id: String!) {
    project: contentfulProjects(id: { eq: $id }) {
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
