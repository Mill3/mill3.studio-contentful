import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '@components/layout'

import Container from '@styles/Container'

const ProjectSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <Container>
        <h1>{data.contentfulProjects.name}</h1>
        <p>{data.contentfulProjects.shortDescription.shortDescription}</p>
      </Container>
    </Layout>
  );
}

export default ProjectSingle;

export const projectQuery = graphql`
  query projectQuery($id: String!) {
    contentfulProjects(id: { eq: $id }) {
      id
      slug
      node_locale
      name
      shortDescription {
        shortDescription
      }
    }
  }
`