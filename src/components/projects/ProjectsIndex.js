import React from 'react'
import { graphql } from 'gatsby'
import { FormattedMessage } from 'gatsby-plugin-intl'
import Container from '@styles/Container'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'


import ClientsFooter from '@components/clients/ClientsFooter'
import ProjectPreview from '@components/projects/ProjectPreview'
import SEO from '@components/seo'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { breakpoints } from '@styles/Theme'
import { TRANSITION_DURATION } from '@utils/constants'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'

const mobileBreakpoint = parseInt(breakpoints[1])



const ProjectsList = ({ projects = [] }) => {
  const columns = {
    width: [1, 1, 1 / 2, 1 / 3],
  }
  const isMobile = Viewport.width < mobileBreakpoint

  const calculateOffset = (index, increment = -120, nth = 3) => {
    let col = (index % nth) + 1

    // first column
    if (col === 1) {
      return increment * 2
      // second column
    } else if (col === 2) {
      return increment
    }

    // default return none
    return 0
  }

  const getOffset = index => {
    if (isMobile) return 0
    else return new ResponsiveProp([null, null, calculateOffset(index, -80, 2), calculateOffset(index, -120, 3)])
  }

  const getDelay = index => {
    if (isMobile) return index === 0 ? TRANSITION_DURATION : 0
    else
      return new ResponsiveProp([
        null,
        null,
        ((index % 2) + 1) * 125 + (index < 2 ? 250 : 0),
        ((index % 3) + 1) * 125 + (index < 3 ? 250 : 0),
      ])
  }

  return projects.map((project, index) => {
    const offset = getOffset(index)
    const delay = getDelay(index)

    return <ProjectPreview key={index} index={index} delay={delay} project={project} columns={columns} offset={offset} />
  })
}


const ProjectsIndex = ({ data, pageContext }) => {
  const { seoFields, projects } = data

  return (
    <>
      <SEO seo={seoFields} url={`projects/`} />
      
      <Container fluid>
        <Flex
          as="header"
          flexDirection="column"
          justifyContent="center"
          pb={[4, null, 3]}
          minHeight={['50vh', null, null, '65vh']}
          className="is-relative"
        >
          <TransitionContainer autoCalculateDelay={false} index={1}>
            <Text
              as={`h1`}
              textAlign="center"
              fontSize={['30px', null, 5, '3.611111111vw']}
              lineHeight={'1.2'}
              mt={[3, null, 0]}
              mb={0}
            >
              <span className="is-sans">Work </span>
              <span className="is-serif fw-900">Work </span>
              <span className="is-sans">Work </span>
              <span className="is-serif fw-900">Work </span>
            </Text>
          </TransitionContainer>
          <TransitionContainer autoCalculateDelay={false} index={1.5}>
            <Text
              as={`h3`}
              textAlign="center"
              fontSize={['4.75vw', '3.8vw', '2.8vw', '1.805vw']}
              pt={['24px', null, 4]}
              px={[0, 0, 0, 0, `10vw`]}
              mb={0}
            >
              <FormattedMessage id="projects.Intro" />
            </Text>
          </TransitionContainer>
        </Flex>

        {/* list of projects */}
        <Flex
          as={ProjectIndexList}
          mx={['-6.35vw', null, -3, '-28px']}
          flexWrap={`wrap`}
          css={{ position: 'relative' }}
        >
          <ProjectsList projects={projects?.edges} />
        </Flex>
      </Container>

      {/* list of clients */}
      <ClientsFooter />
    </>
  )
}

export default ProjectsIndex


export const ProjectIndexList = styled.div`
  @media (max-width: ${props => props.theme.breakpoints[1]}) {
    max-width: 100vw;
    overflow: hidden;
  }
`

export const projectQuery = graphql`
  query allProjectsQuery($language: String!) {
    seoFields : contentfulSeo(slug: { eq: "projects-index" }, node_locale : { eq: $language }) {
      ...seoFragment
    }
    projects : allContentfulProjects(
      filter: { node_locale: { eq: $language } }
      sort: { fields: [publishDate, createdAt], order: DESC }
    ) {
      edges {
        node {
          ...Project
        }
      }
    }
  }
`
