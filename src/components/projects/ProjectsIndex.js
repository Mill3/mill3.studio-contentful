import React, { Component } from 'react'
import { graphql } from 'gatsby'
import ProjectPreview from './ProjectPreview'
import Layout from '@components/layout'
import Container from '@styles/Container'
import { Flex, Box, Text } from 'rebass'
import styled from 'styled-components'
import posed from 'react-pose'

class ProjectsIndex extends Component {

  // constructor(props) {
  //   super(props)
  //   this.state = {  }
  // }

  list() {

    const columns = {
      width: [1,1/2,1/3,1/3],
    }

    if (this.props.data) {
      return this.props.data.allContentfulProjects.edges.map((project, index) =>
        <ProjectPreview key={index} index={index} project={project} columns={columns} />
      )
    }
  }

  render() {
    return (
      <Layout locale={this.props.pageContext.locale}>
        <Container>
          <Flex as={`header`} flexWrap={`wrap`} justifyContent={`center`} mt={[3,3,6]} mb={[3,3,6]}>
            <Text as={`h1`} fontSize={[4,4,5,6]} className={`fw-300`} mb={[3]}>
              <span className="is-serif">Work </span>
              <span className="is-sans">Work </span>
              <span className="is-serif">Work </span>
              <span className="is-sans">Work </span>
            </Text>
            <Text as={`h2`} pl={[2,4,6,`10vw`,'24vw']} pr={[2,4,6,`10vw`,'24vw']} className={`is-center`}>
              We trully believe that good work needs dedicated team, less talking, more doing. Good research leads to effective design, better tech stacks and tailor-made outcomes.
            </Text>
          </Flex>
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
