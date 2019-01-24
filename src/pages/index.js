import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import { FormattedMessage } from 'react-intl'
import { Text } from 'rebass'

import LocalizedLink from '@utils/LocalizedLink'

import Layout from '@components/layout'
import Image from '@components/image'
import SEO from '@components/seo'

import ProjectsList from '@components/projects/ProjectsList'

import Container from '@styles/Container'

const IndexPage = ({ pageContext, data }) => (
  <Layout locale={pageContext.locale}>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <Container>
      <Text as={`h1`} fontSize={[3,4,'10vw']}>Hi people : { pageContext.locale }</Text>
      {data.allContentfulProjects &&
        <ProjectsList data={data.allContentfulProjects} />
      }
      {/* <LocalizedLink to="/page-2/">Go to page 2</LocalizedLink> */}
    </Container>
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
    allContentfulProjects(filter: { node_locale : { eq: $locale }}) {
      edges {
        node {
          id
          slug
          node_locale
          name
          shortDescription {
            shortDescription
          }
        }
      }
    }
  }
`
