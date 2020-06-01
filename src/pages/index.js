import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl, FormattedMessage } from 'react-intl'
import { InView } from 'react-intersection-observer'
import { Box } from 'rebass'

import SEO from '@components/seo'

import HeaderIntro from '@components/header/HeaderIntro'
import DemoReel from '@components/home/DemoReel'
import HomeTitle from '@components/home/HomeTitle'
import StickyTitle from '@components/home/StickyTitle'
import StickyIntro from '@components/home/StickyIntro'
import StickyOutro from '@components/home/StickyOutro'
import ProjectsHome from '@components/projects/ProjectsHome'
import ContactForm from '@components/contact/ContactForm'
import LayoutContext from '@components/contexts/LayoutContext'
import Container from '@styles/Container'
import StickyElement from '@utils/StickyElement'

class IndexPage extends React.Component {
  static contextTypes = {
    layoutState: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      headerInView: true,
      introInView: false,
      introAtEnd: false,
      projectsInView: false,
      outroInView: false,
    }

    this.stickyContainerRef = createRef()
  }

  // componentDidMount() {
  //   this.context.layoutState.setInverted(true)
  // }
  // componentWillUnmount() {
  //   this.context.layoutState.setInverted(false)
  // }

  render() {
    const { data } = this.props
    const { headerInView, introInView, introAtEnd, projectsInView, outroInView } = this.state

    return (
      <LayoutContext.Provider>
        <SEO seo={data.seoFields} />
        <React.Fragment>
          <InView onChange={(inView) => this.setState({ headerInView: inView })}>
            <HeaderIntro />
          </InView>

          <Box ref={this.stickyContainerRef}>
            <InView onChange={(inView) => this.setState({ introInView: inView })} threshold={0.5} triggerOnce={true}>
              <StickyElement target={this.stickyContainerRef.current} onEnd={(ended) => this.setState({ introAtEnd: ended})}>
                <StickyTitle
                  inverted={headerInView}
                  appear={introInView}
                  faded={projectsInView}
                  switchTitle={introAtEnd} />
              </StickyElement>

              <StickyElement target={this.stickyContainerRef.current} mb={["25vh", null, "50vh"]}>
                <StickyIntro inverted={headerInView} appear={introInView} hidden={projectsInView || outroInView} />
              </StickyElement>
            </InView>

            {data.projects && (
              <InView onChange={(inView) => this.setState({ projectsInView: inView })} threshold={0.12}>
                <ProjectsHome data={data.projects} />
              </InView>
            )}

            <InView onChange={(inView) => this.setState({ outroInView: inView })}>
              <Container fluid mt={6} py={0} style={{visibility: 'hidden'}} aria-hidden={true}>
                <HomeTitle>
                  <FormattedMessage id="intro.Lets" />
                  <FormattedMessage id="intro.Work" />
                </HomeTitle>
              </Container>
            </InView>
          </Box>

          <InView onChange={(inView) => this.setState({ outroInView: inView })}>
            <StickyOutro appear={introAtEnd} pt={[0, null, null, null, '100px']} pb={[5, null, 6]} />
            <ContactForm />
          </InView>

          <DemoReel />
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
