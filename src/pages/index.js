import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'
import { injectIntl, FormattedMessage } from 'gatsby-plugin-intl'
import { useInView } from 'react-intersection-observer'
import { Box } from 'rebass'


import ContactForm from '@components/contact/ContactForm'
import HeaderIntro from '@components/header/HeaderIntro'
import DemoReel from '@components/home/DemoReel'
import HomeTitle from '@components/home/HomeTitle'
import StickyTitle from '@components/home/StickyTitle'
import StickyIntro from '@components/home/StickyIntro'
import StickyOutro from '@components/home/StickyOutro'
import ProjectsHome from '@components/projects/ProjectsHome'
import SEO from '@components/seo'
import { LayoutContext } from '@layouts/layoutContext'
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


const IndexPage = ({ data }) => {
  const [ introAtEnd, setIntroAtEnd ] = useState(false)
  const [ projectsInView, setProjectsInView ] = useState(false)
  const { layoutState } = useContext(LayoutContext)
  const { demoReel } = layoutState

  const stickyContainerRef = useRef()
  const isMobile = !Viewport.mq(`(min-width: ${breakpoints[1]})`)

  const [ headerInViewRef, headerInView ] = useInView()
  const [ introInViewRef, introInView ] = useInView({ threshold: 0.5, triggerOnce: true })
  const [ projectsInViewRef, projectsInViewIO, projectsInViewEntry ] = useInView({ threshold: isMobile ? PROJECTS_MOBILE_INVIEW_THRESHOLD : 0.12 })
  const [ letsWorkInViewRef, letsWorkInView ] = useInView()
  const [ outroInViewRef, outroInView ] = useInView()

  // calculate if projects are inView depending on multiple conditions
  useEffect(() => {
    // set new value to value from useInView
    let newValue = projectsInViewIO

    // if complex logics for mobile devices
    if( isMobile ) {
      // if projects are in view
      if( projectsInViewIO ) {
        const { intersectionRatio } = projectsInViewEntry
  
        let newValue = false
  
        // if ratio is greater than our IN_VIEW threshold, fade sticky title
        if( intersectionRatio >= PROJECTS_MOBILE_INVIEW ) newValue = true
        // if Let's Work is in view (meaning we are at the end of the projects list)
        // and ratio is lower than our OUT_VIEW threshold, show sticky title
        else if( letsWorkInView && intersectionRatio > PROJECTS_MOBILE_OUTVIEW ) newValue = true
      }
      else newValue = false
    }

    // update state only if value has changed
    if( newValue !== projectsInView ) setProjectsInView(newValue)

  }, [projectsInViewIO, letsWorkInView, projectsInViewEntry?.intersectionRatio])

  return (
    <>
      <SEO seo={data.seoFields} />

      <>
        <Box ref={headerInViewRef}>
          <HeaderIntro data={data} />
        </Box>

        <Box ref={stickyContainerRef} as={IndexContainer} className={demoReel.active ? '--demoReel' : null}>
          <Box ref={introInViewRef}>
            <StickyElement target={stickyContainerRef.current} onEnd={(ended) => setIntroAtEnd(ended)}>
              <StickyTitle inverted={headerInView} appear={introInView} faded={projectsInView} switchTitle={introAtEnd} />
            </StickyElement>
            <StickyElement target={stickyContainerRef.current} mb={["40vh", null, "50vh"]}>
              <StickyIntro inverted={headerInView} appear={introInView} hidden={projectsInView || letsWorkInView || outroInView} />
            </StickyElement>
          </Box>

          {data.projects && (
            <Box ref={projectsInViewRef}>
              <ProjectsHome data={data.projects} />
            </Box>
          )}

          <Box ref={letsWorkInViewRef}>
            <Container fluid mt={6} py={0} style={{visibility: 'hidden'}} aria-hidden={true}>
              <HomeTitle>
                <FormattedMessage id="intro.Lets" />
                <FormattedMessage id="intro.Work" />
              </HomeTitle>
            </Container>
          </Box>
        </Box>

        <Box ref={outroInViewRef}>
          <StickyOutro appear={introAtEnd} pb={[100, null, 6]} />
          <ContactForm />
        </Box>

        <DemoReel />
      </>
    </>
  )
}

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
    demoReelMobile : contentfulVideoItem(slug: { eq: "demo-reel-mobile" }, node_locale : { eq: $language }) {
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
