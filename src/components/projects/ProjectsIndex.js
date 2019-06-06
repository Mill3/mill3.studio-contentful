import React, { Component } from 'react'
import { graphql } from 'gatsby'
import ProjectPreview from './ProjectPreview'
import Layout from '@components/layout'
import Container from '@styles/Container'
import { Flex, Box, Text } from 'rebass'

class ProjectsIndex extends Component {

  list() {

    const columns = {
      width: [1,1/2,1/3,1/3],
    }

    if (this.props.data) {
      return this.props.data.allContentfulProjects.edges.map((project, index) => {
          return <ProjectPreview key={index} index={index} project={project} columns={columns} offset={/*(index % 3 - 1) * 0.1*/0} />
        }
      )
    }
  }

  render() {
    return (
      <Layout locale={this.props.pageContext.locale}>
        <Container>
          <Box as={`header`} mb={6}>
            <Text as={`h1`} fontSize={[4,5,6,7,7]} className={`fw-300`} mb={[3]} textAlign={`center`}>
              <span className="is-serif">Work </span>
              <span className="is-sans">Work </span>
              <span className="is-serif">Work </span>
              <span className="is-sans">Work </span>
            </Text>
            <Text as={`h3`} fontSize={[3,3,4]} px={[2,4,6,`10vw`,'14vw']} mb={0} textAlign={`center`}>
              We trully believe that good work needs dedicated team, less talking, more doing. Good research leads to effective design, better tech stacks and tailor-made outcomes.
            </Text>
          </Box>
          <Flex as={`section`} flexWrap={`wrap`}>
            {this.list()}
          </Flex>
        </Container>
      </Layout>
    );
  }
}

export default ProjectsIndex

export const projectQuery = graphql`
  query allProjectsQuery($locale: String!) {
    allContentfulProjects(filter: { node_locale : { eq: $locale }}) {
      edges {
        node {
          ...Project
        }
      }
    }
  }
`
