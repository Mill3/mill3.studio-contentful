import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

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

  componentWillMount() {
    this.context.set({ inverted: true, locale: this.props.locale })
  }

  componentWillUnmount() {
    this.context.set({ inverted: false, locale: this.props.locale })
  }

  render() {
    const { data } = this.props
    return (
      <LayoutContext.Provider>
        <SEO title={null} />
        <React.Fragment>
          {/* <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} /> */}
          <HeaderIntro transitionStatus={'entering'} />
          <Container fluid>{data.allContentfulProjects && <ProjectsHome data={data.allContentfulProjects} />}</Container>
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

export default IndexPage

export const projectQuery = graphql`
  query projectsHomeQuery($locale: String!) {
    allContentfulProjects(limit: 6, filter: { node_locale: { eq: $locale } }) {
      edges {
        node {
          ...Project
        }
      }
    }
  }
`
