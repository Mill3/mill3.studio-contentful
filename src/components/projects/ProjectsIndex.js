import React, { Component } from 'react'
import { graphql } from 'gatsby'
import ProjectPreview from './ProjectPreview'
import { FormattedMessage } from 'react-intl'
import Container from '@styles/Container'
import { Flex, Box, Text } from 'rebass'

import HeaderCircle from '@components/header/HeaderCircle'
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
      if( isMobile ) return index === 0 ? TRANSITION_DURATION * 2 : 0
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
      <>
        <Container fluid>
          <Box as={`header`} mb={6}>
            <Text as={`h1`} fontSize={['6.763285024vw', null, '3.611111111vw']} className={`fw-300`} mb={['6vw', null, '3vw']} textAlign={`center`}>
              <span className="is-sans"><FormattedMessage id="nav.Work" /> </span>
              <span className="is-serif"><FormattedMessage id="nav.Work" /> </span>
              <span className="is-sans"><FormattedMessage id="nav.Work" /> </span>
              <span className="is-serif"><FormattedMessage id="nav.Work" /> </span>
            </Text>
            <Text as={`h3`} fontSize={['4.830917874vw', null, '1.805555556vw']} width={['100%', null, '75vw']} mx={'auto'} mb={0} textAlign={`center`}>
              <FormattedMessage id="projects.Intro" />
            </Text>
          </Box>
          <Flex as={`section`} mx={['-5vw', null, -3, -4]} flexWrap={`wrap`} css={{position: 'relative'}}>
            <HeaderCircle pl={['5vw', null, 0]} ml={[0, null, -3]} css={{top: 0, bottom: 'auto', transform: 'translateY(-55%)'}} />
            {this.list()}
          </Flex>
        </Container>
      </>
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
