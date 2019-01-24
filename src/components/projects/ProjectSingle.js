import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '@components/layout'

const ProjectSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <div>
        <h1>{data.contentfulProjects.name}</h1>
        <p>{data.contentfulProjects.shortDescription.shortDescription}</p>
      </div>
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