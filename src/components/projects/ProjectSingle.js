import React from 'react'
import { graphql } from 'gatsby'
import { Flex, Box, Text } from 'rebass'
import { FormattedMessage } from 'react-intl'

import Container from '@styles/Container'
import ContentRow from '@components/content_rows'
import SingleHeader from '@components/elements/SingleHeader'
import TransitionLinkComponent from '@utils/TransitionLink'
import Button, { LinkButton } from '@components/buttons'

const ProjectSingle = ({ pageContext, data }) => {
  return (
    <React.Fragment>

      <Container fluid>
        <SingleHeader
          label="Projects:"
          title={data.project.name}
          subHeading={data.project.subHeading ? data.project.subHeading.subHeading : null}
          media={data.project.headerMedia}
        />
      </Container>

      <ContentRow data={data.project.contentRows} />

      <Container fluid={true}>
        <Flex flexDirection="column">
          {data.project.url &&
          <Box mx="auto">
            <a href={data.project.url} target="_blank" without="true" rel="noopener noreferrer">
              <Button>Visit website</Button>
            </a>
          </Box>
          }
          {data.next &&
            <Box mx="auto" mt={4} mb={5}>
              <Text textAlign="center" as={`h6`} mb={[3]} fontSize={[2, 3]} color="blue">
                <FormattedMessage id={`Next project :`} />
              </Text>
              <TransitionLinkComponent
                to={`/projects/${data.next.slug}`}
                title={data.next.name}
                color={data.next.colorMain}
              >
                <LinkButton hoverColor={data.next.colorMain}>
                  {data.next.name}
                </LinkButton>
              </TransitionLinkComponent>
            </Box>
          }
        </Flex>
      </Container>

    </React.Fragment>
  )
}

export default ProjectSingle

export const projectQuery = graphql`
  query projectQuery($id: String!, $locale: String!, $nextId: String!) {
    next: contentfulProjects(id: { eq: $nextId }, node_locale : { eq: $locale }) {
      ...Project
    }
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
        ... on ContentfulContentSlides {
          ...ContentSlidesFragement
        }
      }
    }
  }
`
