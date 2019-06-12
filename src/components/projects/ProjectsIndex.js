import React, { Component } from 'react'
import { graphql } from 'gatsby'
import ProjectPreview from './ProjectPreview'
import Layout from '@components/layout'
import Container from '@styles/Container'
import { Flex, Box, Text } from 'rebass'

import { breakpoints } from '@styles/Theme'
import { TRANSITION_DURATION } from '@utils/constants'
import Viewport from '@utils/Viewport'

const mobileBreakpoint = parseInt(breakpoints[1])
const tabletBreakpoint = parseInt(breakpoints[2])

class ProjectsIndex extends Component {

  list() {

    const columns = {
      width: [1, 1, 1/2, 1/3],
    }
    const isMobile = Viewport.width < mobileBreakpoint
    const isTablet = Viewport.width < tabletBreakpoint

    const getOffset = (index) => {
      if( isMobile ) return 0
      else if( isTablet ) return index % 2 === 1 ? -160 : 0
      else return index % 3 === 1 ? -160 : 0
    }
    const getDelay = (index) => {
      if( isMobile ) return index === 0 ? TRANSITION_DURATION * 2000 : 0
      else if( isTablet ) return ((index % 2) + 1) * 125 + (index < 2 ? 250 : 0)
      else return ((index % 3) + 1) * 125 + (index < 3 ? 250 : 0)
    }

    if (this.props.data) {
      return this.props.data.allContentfulProjects.edges.map((project, index) => {
          const offset = getOffset(index)
          const delay = getDelay(index)

          return (
            <ProjectPreview
              key={index}
              delay={delay}
              project={project}
              columns={columns}
              offset={offset}
            />
          )
        }
      )
    }
  }

  render() {
    return (
      <Layout locale={this.props.pageContext.locale}>
        <Container fluid>
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
          <Flex as={`section`} mx={['-5vw', null, -3, -4]} flexWrap={`wrap`}>
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
