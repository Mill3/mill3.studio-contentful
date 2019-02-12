import React, { Component } from 'react'
import { graphql } from 'gatsby'
import ProjectPreview from './ProjectPreview'
import Layout from '@components/layout'
import Container from '@styles/Container'
import { Flex, Box } from 'rebass'
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
          <Flex as={`section`} flexWrap={`wrap`}>
            {/* <h1>Projects yo!</h1> */}
            {this.list()}
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
    allContentfulProjects(limit: 3, filter: { node_locale : { eq: $locale }}) {
      edges {
        node {
          ...Project
        }
      }
    }
  }
`
