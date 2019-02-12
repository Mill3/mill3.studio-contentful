import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import { FormattedMessage } from 'react-intl'
import { Text } from 'rebass'

import Layout from '@components/layout'
import Image from '@components/image'
import SEO from '@components/seo'

import ProjectsHome from '@components/projects/ProjectsHome'
import ClientsTicker from '@components/clients/ClientsTicker'

import Container from '@styles/Container'

const IndexPage = ({ pageContext, data }) => (
  <Layout locale={pageContext.locale} withIntro={true}>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <Container>
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
  query allProjectsQuery($locale: String!) {
    allContentfulProjects(limit: 3, filter: { node_locale : { eq: $locale }}) {
      edges {
        node {
          id
          slug
          node_locale
          name
          colorMain
          imageMain {
            fluid(maxWidth: 1800, quality: 85) {
              ...GatsbyContentfulFluid_noBase64
            }
          }
          shortDescription {
            shortDescription
          }
        }
      }
    }
  }
`
