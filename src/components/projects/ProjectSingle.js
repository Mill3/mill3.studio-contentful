import React, { Component } from 'react'
import { graphql } from 'gatsby'
import Img from "gatsby-image"
import Layout from '@components/layout'
import RichTextRenderer from '@utils/RichTextRenderer'
import posed from 'react-pose'
import styled from 'styled-components'
import SplitText from 'react-pose-text'

import Container from '@styles/Container'

const { BLOCKS, MARKS, INLINES } = require('@contentful/rich-text-types')

const ProjectSingleContainer = styled.div`
  min-height: 4000px;
  border: 1px solid rebeccapurple;
`

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

const ProjectInline = ({ title }) => {
  return (
    <article>Project : {title}</article>
  )
}

const ClientInline = ({ title }) => {
  return (
    <article>Client : {title}</article>
  )
}

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

  const options = {
    renderNode: {
      [BLOCKS.HEADING_2]: (node, next) => {
        const t = next(node.content).toString()
        return (
          <h2>
            <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
              {t}
            </SplitText>
          </h2>
        )
      },
      [BLOCKS.EMBEDDED_ASSET]: (node, next) => <img className="img-fluid" src={node.data.target.fields.file['en'].url} />,
      [BLOCKS.EMBEDDED_ENTRY]: (node, next) => {
        const Components = {
          'projects': ProjectInline,
          'clients': ClientInline
        }
        const contentType = node.data.target.sys.contentType.sys.id
        const Component = Components[contentType]
        return (
          <Component title={node.data.target.fields.name['en']} />
        )
      },
    },
    locale: `en`,
  }

  return (
    <Layout locale={pageContext.locale}>
      <Container>
        <ProjectSingleContainer>
          <h1>{data.contentfulProjects.name}</h1>
          {data.contentfulProjects.content &&
            <RichTextRenderer options={options} content={data.contentfulProjects.content.childContentfulRichText.internal.content} />
          }
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
      content {
        childContentfulRichText {
          html
          timeToRead
          internal {
            content
          }
        }
      }
    }
  }
`