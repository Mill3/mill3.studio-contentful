import React, { Component } from 'react'
import { graphql } from 'gatsby'
import Layout from '@components/layout'
import styled from 'styled-components'
import SplitText from 'react-pose-text'

import Container from '@styles/Container'

import ContentRow from '@components/content_rows'
import RowContentText from '@components/content_rows/ContentText'

const ProjectSingleContainer = styled.div`
  min-height: 2000px;
`

const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => charIndex * 30,
    transition: {
      y: {
        type: 'spring'
      }
    }
  }
};

const ProjectSingle = ({ pageContext, data }) => {
  return (
    <Layout locale={pageContext.locale}>
      <Container>
        <ProjectSingleContainer>
          <h1>{data.contentfulProjects.name}</h1>
          <hr/>
          <ContentRow data={data.contentfulProjects.contentRows} />
        </ProjectSingleContainer>
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
      contentRows {
        __typename
        ... on ContentfulContentText {
          ...ContentTextFragement
        }
        ... on ContentfulContentImages {
          ...ContentImagesFragement
        }
      }
    }
  }
`