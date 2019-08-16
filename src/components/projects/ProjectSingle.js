import React from 'react'
import { graphql } from 'gatsby'
import { Flex, Box, Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'
import { useInView } from 'react-intersection-observer'


import LayoutContext from '@components/contexts/LayoutContext'

import Container from '@styles/Container'
import ContentRow from '@components/content_rows'

import SingleHeader from '@components/elements/SingleHeader'
import ServicesList from '@components/services/ServicesList'
import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import Button, { LinkButton } from '@components/buttons'
import SEO from '@components/seo'

const ProjectFooter = ({ next }) => {
  const [ref, inView] = useInView({ triggerOnce: false })

  return (
    <Box mx="auto" mt={4} mb={5}>
        <Text textAlign="center" as={`h6`} mb={[3]} fontSize={[2, 3]} color="blue">
          <FormattedMessage id={`projects.single.next`} />
        </Text>
        <TransitionLinkComponent
          to={`/projects/${next.slug}/`}
          title={next.transitionName || null}
          color={next.colorMain}
        >
          <Box ref={ref}>
            <LinkButton
              hoverColor={next.colorMain}
              fontSize={['30px', null, 5, '10vw']}
              fontWeight={500}
              lineHeight={'1.2'}
              className={`is-serif`}
              hover={inView}
            >
              <span>
                {next.name}
              </span>
            </LinkButton>
          </Box>
        </TransitionLinkComponent>
      </Box>
  );
}

const ProjectSingle = ({ intl, pageContext, data }) => {
  const { project, next } = data

  return (
    <LayoutContext.Provider set={{ color: `#fff` }}>

      <SEO
        seo={project.seo}
        locale={pageContext.locale}
        url={`projects/${project.slug}/`}
        title={!project.seo ? project.name : null}
        description={!project.seo ? (project.subHeading ? project.subHeading.subHeading : null) : null}
        image={!project.seo ? (project.headerMedia && project.headerMedia.file ? project.headerMedia.file.url : null) : null}
      />

      <Container fluid>
        <SingleHeader
          label={{
            text: "projects.label",
            url: "/projects/",
            transitionColor: "#000",
          }}
          title={project.name}
          subHeading={project.subHeading ? project.subHeading.subHeading : null}
          media={project.headerMedia}
        />
      </Container>

      <ContentRow data={project.contentRows} />

      {/* services */}
      {project.services &&
        <ServicesList data={project.services} />
      }

      <Container fluid={true}>
        <TransitionContainer distance={0} autoCalculateDelay={false} index={0}>
          <Flex flexDirection="column" my={[5,5,6]}>
            {project.url &&
            <Box mx="auto" mb={[3,3,`100px`]}>
              <a href={project.url} target="_blank" without="true" rel="noopener noreferrer">
                <Button>{intl.formatMessage({id: 'projects.single.website'}).toString()}</Button>
              </a>
            </Box>
            }
            {next &&
              <ProjectFooter next={next} />
            }
          </Flex>
        </TransitionContainer>
      </Container>

    </LayoutContext.Provider>
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
      services {
        title
      }
      contentRows {
        __typename
        ... on ContentfulContentText {
          ...ContentTextFragement
        }
        ... on ContentfulContentImages {
          ...ContentImagesFragement
        }
        ... on ContentfulContentSlides {
          ...ContentSlidesFragement
        }
      }
    }
  }
`
