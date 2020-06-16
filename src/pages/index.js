import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import { injectIntl, FormattedMessage } from 'gatsby-plugin-intl'
import { InView } from 'react-intersection-observer'
import { Box } from 'rebass'

import SEO from '@components/seo'

import { LayoutContext } from '@layouts'
import HeaderIntro from '@components/header/HeaderIntro'
import DemoReel from '@components/home/DemoReel'
import HomeTitle from '@components/home/HomeTitle'
import StickyTitle from '@components/home/StickyTitle'
import StickyIntro from '@components/home/StickyIntro'
import StickyOutro from '@components/home/StickyOutro'
import ProjectsHome from '@components/projects/ProjectsHome'
import ContactForm from '@components/contact/ContactForm'
import Container from '@styles/Container'
import StickyElement from '@utils/StickyElement'

const IndexContainer = styled.div`
  opacity: 1;
  transition: opacity 650ms 1050ms linear;

  &.--demoReel {
    opacity: 0;
    transition: opacity 450ms linear;
  }
`

class IndexPage extends React.Component {

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

  componentDidMount() {
    // console.log(this.context);
    this.context.dispatch({type: "header.invert"})
    // this.context.dispatch({type: "body.invert"})
  }

  componentWillUnmount() {
    this.context.dispatch({type: "header.reset"})
  }

  render() {
    const { data } = this.props
    const { headerInView, introInView, introAtEnd, projectsInView, outroInView } = this.state
    const { layoutState } = this.context

    return (
        <>
          <SEO seo={data.seoFields} />

          <React.Fragment>
            <InView onChange={(inView) => this.setState({ headerInView: inView })}>
              <HeaderIntro data={data} />
            </InView>

            <Box ref={this.stickyContainerRef} as={IndexContainer} className={layoutState.demoReel.active ? '--demoReel' : null}>
              <InView onChange={(inView) => this.setState({ introInView: inView })} threshold={0.5} triggerOnce={true}>
                <StickyElement contained={false} target={this.stickyContainerRef.current} onEnd={(ended) => this.setState({ introAtEnd: ended})}>
                  <StickyTitle
                    inverted={headerInView}
                    appear={introInView}
                    faded={projectsInView}
                    switchTitle={introAtEnd} />
                </StickyElement>

                <StickyElement contained={false} target={this.stickyContainerRef.current} mb={["40vh", null, "50vh"]}>
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
              <StickyOutro appear={introAtEnd} pb={[5, null, 6]} />
              <ContactForm />
            </InView>

            <DemoReel />
          </React.Fragment>
        </>

    )
  }
}

// IndexPage.propTypes = {
//   pageContext: PropTypes.shape({
//     locale: PropTypes.string.isRequired,
//   }).isRequired,
// }

// export default IndexPage

IndexPage.contextType = LayoutContext

export default injectIntl(IndexPage)

export const homeQuery = graphql`
  query homeQuery($language: String!) {
    seoFields: contentfulSeo(slug: { eq: "homepage" }, node_locale: { eq: $language }) {
      ...seoFragment
    }
    projects: allContentfulProjects(
      limit: 6
      filter: { node_locale: { eq: $language }, displayOnHomepage: { eq: true } }
      sort: { fields: [publishDate, createdAt], order: DESC }
    ) {
      edges {
        node {
          ...Project
        }
      }
    }
    demoReel: contentfulVideoItem(slug: { eq: "demo-reel" }, node_locale: { eq: $language }) {
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
