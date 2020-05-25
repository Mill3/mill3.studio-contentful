import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl } from 'react-intl'
import { InView } from 'react-intersection-observer'

import SEO from '@components/seo'

import HeaderIntro from '@components/header/HeaderIntro'
import StickyIntro from '@components/home/StickyIntro'
import StickyOutro from '@components/home/StickyOutro'
import ProjectsHome from '@components/projects/ProjectsHome'
import ContactForm from '@components/contact/ContactForm'
import LayoutContext from '@components/contexts/LayoutContext'

class IndexPage extends React.Component {
  static contextType = LayoutContext

  constructor(props) {
    super(props)

    this.state = {
      headerInView: true,
      projectsInView: false,
      outroInView: false,
    }
  }

  render() {
    const { data } = this.props
    const { headerInView, projectsInView, outroInView } = this.state

    return (
      <LayoutContext.Provider>
        <SEO seo={data.seoFields} />
        <React.Fragment>
          <InView onChange={(inView) => this.setState({ headerInView: inView })}>
            <HeaderIntro />
          </InView>

          <StickyIntro
            inverted={headerInView}
            sticky={!headerInView && projectsInView}
            fadeTitle={!headerInView && projectsInView}
            hideText={!headerInView}
            switchTitle={!projectsInView && outroInView}
           />

          {data.projects && (
            <InView onChange={(inView) => this.setState({ projectsInView: inView })} threshold={0.05}>
              <ProjectsHome data={data.projects} />
            </InView>
          )}

          <InView onChange={(inView) => this.setState({ outroInView: inView })}>
            <StickyOutro />
          </InView>

          <ContactForm />
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
