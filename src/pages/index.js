import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '@components/layout'
import SEO from '@components/seo'

import ProjectsHome from '@components/projects/ProjectsHome'
import ClientsTicker from '@components/clients/ClientsTicker'
import HeaderIntro from '@components/header/HeaderIntro'

import Container from '@styles/Container'

const IndexPage = ({ pageContext, data }) => (
  <Layout locale={pageContext.locale} withIntro={true} introComponent={HeaderIntro}>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <Container fluid>
      {data.allContentfulProjects &&
        <ProjectsHome data={data.allContentfulProjects} />
      }
    </Container>
    <ClientsTicker/>
  </Layout>
)

IndexPage.propTypes = {
  pageContext: PropTypes.shape({
    locale: PropTypes.string.isRequired
  }).isRequired
}

export default IndexPage

export const projectQuery = graphql`
  query projectsHomeQuery($locale: String!) {
    allContentfulProjects(limit: 3, filter: { node_locale : { eq: $locale }}) {
      edges {
        node {
          ...Project
        }
      }
    }
  }
`
