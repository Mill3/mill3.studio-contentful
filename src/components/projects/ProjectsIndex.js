import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { FormattedMessage } from 'react-intl'
import Container from '@styles/Container'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import TransitionContainer from '@components/transitions/TransitionContainer'
import ProjectPreview from './ProjectPreview'
import SEO from '@components/seo'
import HeaderCircle from '@components/header/HeaderCircle'
import { breakpoints } from '@styles/Theme'
import { TRANSITION_DURATION } from '@utils/constants'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'

const mobileBreakpoint = parseInt(breakpoints[1])

const ProjectIndexHeader = styled.header`
  min-height: 50vh;
`

export const ProjectIndexList = styled.div`
  @media (max-width: ${props => props.theme.breakpoints[1]}) {
    max-width: 100vw;
    overflow: hidden;
  }
`

class ProjectsIndex extends Component {

  list() {

    const columns = {
      width: [1, 1, 1/2, 1/3],
    }
    const isMobile = Viewport.width < mobileBreakpoint
    const total = this.props.data.allContentfulProjects.edges.length

    const calculateOffset = (index, increment = -120, nth = 3) => {
      let col = (index % nth) + 1;

      // first column
      if (col === 1) {
        return increment * 2
      // second column
      } else if(col === 2) {
        return increment
      }

      // default return none
      return 0
    }

    const getOffset = (index) => {
      if( isMobile ) return 0
      else return new ResponsiveProp([
        null,
        null,
        calculateOffset(index, -80, 2),
        calculateOffset(index, -120, 3)
      ])
    }

    const getDelay = (index) => {
      if( isMobile ) return index === 0 ? TRANSITION_DURATION : 0
      else return new ResponsiveProp([
        null,
        null,
        ((index % 2) + 1) * 125 + (index < 2 ? 250 : 0),
        ((index % 3) + 1) * 125 + (index < 3 ? 250 : 0)
      ])
    }

    if (this.props.data) {
      return this.props.data.allContentfulProjects.edges.map((project, index) => {
          const offset = getOffset(index)
          const delay = getDelay(index)

          return (
            <ProjectPreview
              key={index}
              index={index}
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
        <SEO title={`nav.Work`} translate={true} />
        <Container fluid>
          <Flex as={ProjectIndexHeader} flexDirection="column" justifyContent="center" pb={[4, null, 3]} className="is-relative">
            <TransitionContainer index={1}>
              <Text as={`h1`} fontSize={['6.763285024vw', null, '3.611111111vw']} className={`fw-300`} mb={['6vw', null, '3vw']} textAlign={`center`}>
                <span className="is-sans"><FormattedMessage id="nav.Work" /> </span>
                <span className="is-serif fw-900"><FormattedMessage id="nav.Work" /> </span>
                <span className="is-sans"><FormattedMessage id="nav.Work" /> </span>
                <span className="is-serif fw-900"><FormattedMessage id="nav.Work" /> </span>
              </Text>
            </TransitionContainer>
            <TransitionContainer index={1.25}>
              <Text as={`h3`} fontSize={['4.830917874vw', null, '1.805555556vw']} width={['100%', null, '75vw']} mx={'auto'} mb={0} textAlign={`center`}>
                <FormattedMessage id="projects.Intro" />
              </Text>
            </TransitionContainer>

            <HeaderCircle ml={['-5vw', null, -3, '-28px']} css={{transform: 'translateY(45%)'}} />
          </Flex>
          <Flex as={ProjectIndexList} mx={['-5vw', null, -3, '-28px']} flexWrap={`wrap`} css={{position: 'relative'}}>
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
    allContentfulProjects(filter: { node_locale : { eq: $locale }}, sort: { fields: [createdAt], order: DESC }) {
      edges {
        node {
          ...Project
        }
      }
    }
  }
`
