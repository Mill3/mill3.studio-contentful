import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl } from 'react-intl'

import SEO from '@components/seo'

import HeaderIntro from '@components/header/HeaderIntro'
import ProjectsHome from '@components/projects/ProjectsHome'
import ClientsTicker from '@components/clients/ClientsTicker'
import ContactForm from '@components/contact/ContactForm'

import Container from '@styles/Container'

import LayoutContext from '@components/contexts/LayoutContext'

class IndexPage extends React.Component {
  static contextType = LayoutContext

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { data } = this.props
    return (
      <LayoutContext.Provider>
        <SEO seo={data.seoFields} />
        <React.Fragment>
          <HeaderIntro />
          <Container fluid>
            {(data.projects) && <ProjectsHome data={data.projects} />}
          </Container>
          <ClientsTicker />
          <ContactForm my={[2, 3, 5]} />
        </React.Fragment>
      </LayoutContext.Provider>
    )
  }
}

IndexPage.propTypes = {
  pageContext: PropTypes.shape({
    locale: PropTypes.string.isRequired,
  }).isRequired,
}

export default injectIntl(IndexPage)

export const projectQuery = graphql`
  query projectsHomeQuery($locale: String!) {
    seoFields : contentfulSeo(slug: { eq: "homepage" }, node_locale : { eq: $locale }) {
      ...seoFragment
    }
    projects : allContentfulProjects(limit: 6, filter: { node_locale: { eq: $locale }, displayOnHomepage: { eq: true } }, sort: { fields: [publishDate, createdAt], order: DESC }) {
      edges {
        node {
          ...Project
        }
      }
    }
  }
`
