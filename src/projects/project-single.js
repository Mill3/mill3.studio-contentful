import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
    console.log(this.props.data.contentfulProjects.name);

  }
  render() {
    return (
      <Layout>
        <div>
          <h1>{this.props.data.contentfulProjects.name}</h1>
          <p>{this.props.data.contentfulProjects.shortDescription.shortDescription}</p>
        </div>
      </Layout>
    );
  }
}

export default Project

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