import React from 'react'
import { graphql } from 'gatsby'
import { Flex, Box, Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'

import Container from '@styles/Container'
import ContentRow from '@components/content_rows'
import SingleHeader from '@components/elements/SingleHeader'
import TransitionLinkComponent from '@utils/TransitionLink'
import Button, { LinkButton } from '@components/buttons'
import SEO from '@components/seo'

const ProjectSingle = ({ intl, pageContext, data }) => {
  const { project, next } = data

  return (
    <React.Fragment>

      <SEO
        seo={project.seo}
        title={!project.seo ? project.name : null}
        description={!project.seo ? (project.subHeading ? project.subHeading.subHeading : null) : null}
        image={!project.seo ? (project.headerMedia && project.headerMedia.file ? project.headerMedia.file.url : null) : null}
      />

      <Container fluid>
        <SingleHeader
          label="projects.single.label"
          title={project.name}
          subHeading={project.subHeading ? project.subHeading.subHeading : null}
          media={project.headerMedia}
        />
      </Container>

      <ContentRow data={project.contentRows} />

      <Container fluid={true}>
        <Flex flexDirection="column">
          {project.url &&
          <Box mx="auto">
            <a href={project.url} target="_blank" without="true" rel="noopener noreferrer">
              <Button>{intl.formatMessage({id: 'projects.single.website'}).toString()}</Button>
            </a>
          </Box>
          }
          {next &&
            <Box mx="auto" mt={4} mb={5}>
              <Text textAlign="center" as={`h6`} mb={[3]} fontSize={[2, 3]} color="blue">
                <FormattedMessage id={`projects.single.next`} />
              </Text>
              <TransitionLinkComponent
                to={`/projects/${next.slug}`}
                title={next.name}
                color={next.colorMain}
              >
                <LinkButton hoverColor={next.colorMain}>
                  {next.name}
                </LinkButton>
              </TransitionLinkComponent>
            </Box>
          }
        </Flex>
      </Container>

    </React.Fragment>
  )
}

export default injectIntl(ProjectSingle)

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
      seo {
        ...seoFragment
      }
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
