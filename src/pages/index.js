import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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
import { breakpoints } from '@styles/Theme'
import StickyElement from '@utils/StickyElement'
import Viewport from '@utils/Viewport'


const PROJECTS_MOBILE_INVIEW = 0.12
const PROJECTS_MOBILE_OUTVIEW = 0.03
const PROJECTS_MOBILE_INVIEW_THRESHOLD = [PROJECTS_MOBILE_OUTVIEW, PROJECTS_MOBILE_INVIEW]
const IndexContainer = styled.div`
  opacity: 1;
  transition: opacity 650ms 1050ms linear;

  &.--demoReel {
    opacity: 0;
    transition: opacity 450ms linear;
  }
`

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
      letsWorkInView: false,
      outroInView: false,
    }

    this.stickyContainerRef = createRef()
    this.onProjectsInView = this.onProjectsInView.bind(this)
    this.onProjectsMobileInView = this.onProjectsMobileInView.bind(this)
  }

  onProjectsInView(inView, entry) { this.setState({ projectsInView: inView }) }
  onProjectsMobileInView(inView, entry) {
    if( inView === true ) {
      const { letsWorkInView, projectsInView } = this.state
      const { intersectionRatio } = entry

      let value = false

      // if ratio is greater than our IN_VIEW threshold, fade sticky title
      if( intersectionRatio >= PROJECTS_MOBILE_INVIEW ) value = true
      // if Let's Work is in view (meaning we are at the end of the projects list)
      // and ratio is lower than our OUT_VIEW threshold, show sticky title
      else if( letsWorkInView && intersectionRatio > PROJECTS_MOBILE_OUTVIEW ) value = true

      // update state only if required
      if( value !== projectsInView ) this.setState({ projectsInView: value })
    }
    else this.setState({ projectsInView: false })
  }

  render() {
    const { data } = this.props
    const { headerInView, introInView, introAtEnd, projectsInView, letsWorkInView, outroInView } = this.state
    const { demoReel } = this.context.layoutState
    const isMobile = !Viewport.mq(`(min-width: ${breakpoints[1]})`)

    return (
      <LayoutContext.Provider>
        <SEO seo={data.seoFields} />
        <React.Fragment>
          <InView onChange={(inView) => this.setState({ headerInView: inView })}>
            <HeaderIntro data={data} />
          </InView>

          <Box ref={this.stickyContainerRef} as={IndexContainer} className={demoReel.active ? '--demoReel' : null}>
            <InView onChange={(inView) => this.setState({ introInView: inView })} threshold={0.5} triggerOnce={true}>
              <StickyElement contained={false} target={this.stickyContainerRef.current} onEnd={(ended) => this.setState({ introAtEnd: ended})}>
                <StickyTitle
                  inverted={headerInView}
                  appear={introInView}
                  faded={projectsInView}
                  switchTitle={introAtEnd} />
              </StickyElement>

              <StickyElement contained={false} target={this.stickyContainerRef.current} mb={["40vh", null, "50vh"]}>
                <StickyIntro inverted={headerInView} appear={introInView} hidden={projectsInView || letsWorkInView || outroInView} />
              </StickyElement>
            </InView>

            {data.projects && (
              <InView
                onChange={isMobile ? this.onProjectsMobileInView : this.onProjectsInView}
                threshold={isMobile ? PROJECTS_MOBILE_INVIEW_THRESHOLD : 0.12}
              >
                <ProjectsHome data={data.projects} />
              </InView>
            )}

            <InView onChange={(inView) => this.setState({ letsWorkInView: inView })}>
              <Container fluid mt={6} py={0} style={{visibility: 'hidden'}} aria-hidden={true}>
                <HomeTitle>
                  <FormattedMessage id="intro.Lets" />
                  <FormattedMessage id="intro.Work" />
                </HomeTitle>
              </Container>
            </InView>
          </Box>

          <InView onChange={(inView) => this.setState({ outroInView: inView })}>
            <StickyOutro appear={introAtEnd} pb={[100, null, 6]} />
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

export const homeQuery = graphql`
  query homeQuery($locale: String!) {
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
    demoReel : contentfulVideoItem(slug: { eq: "demo-reel" }, node_locale : { eq: $locale }) {
      id
      video {
        id
        file {
          url
          fileName
          contentType
        }
      }
    }
    demoReelMobile : contentfulVideoItem(slug: { eq: "demo-reel-mobile" }, node_locale : { eq: $locale }) {
      id
      video {
        id
        file {
          url
          fileName
          contentType
        }
      }
    }
  }
`
