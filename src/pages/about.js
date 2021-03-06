import React, { useContext, useEffect } from 'react'
import { graphql } from 'gatsby'
import { Box } from 'rebass'
import { injectIntl } from 'gatsby-plugin-intl'
import { useInView } from 'react-intersection-observer'

import AboutIntro from '@components/about/AboutIntro'
import AboutTeam from '@components/about/AboutTeam'
import AboutProcess from '@components/about/AboutProcess'
import AboutServices from '@components/about/AboutServices'
import AboutClients from '@components/about/AboutClients'
import ContactForm from '@components/contact/ContactForm'
import SEO from '@components/seo'
import { LayoutContext } from '@layouts/layoutContext'
import ResponsiveProp from '@utils/ResponsiveProp'

const HEADER_INVIEW_THRESHOLD = new ResponsiveProp([0.1, null, 0.25])
const SERVICES_INVIEW_THRESHOLD = new ResponsiveProp([0.2, null, 0.5])

const About = ({ data }) => {
  const [ headerInViewRef, headerInView ] = useInView({ threshold: HEADER_INVIEW_THRESHOLD.getValue() })
  const [ servicesInViewRef, servicesInView ] = useInView({ threshold: SERVICES_INVIEW_THRESHOLD.getValue() })
  const { layoutState, dispatch } = useContext(LayoutContext)
  const { page } = data
  const color = layoutState.invertedBody ? `#fff` : `#000`

  useEffect(() => {
    dispatch({ type: headerInView || servicesInView ? 'inverted.set' :'inverted.reset' })
  }, [headerInView, servicesInView])

  return (
    <>
      {page.seo && <SEO seo={page.seo} url={`${page.slug}/`} />}

      <Box>
        <Box ref={headerInViewRef}>
          {/* the intro */}
          <AboutIntro data={page.intro} />

          {/* Team */}
          <AboutTeam data={{ teamIntro: page.teamIntro, teamMembers: page.teamMembers }} color={color} />
        </Box>

        <AboutProcess data={{ processIntro: page.processIntro, processes: page.processes }} color={color} />

        <Box ref={servicesInViewRef}>
          <AboutServices data={{ servicesIntro: page.servicesIntro, services: page.services }} color={color} />
        </Box>

        <AboutClients data={{ clientsIntro: page.clientsIntro }} />
      </Box>

      <Box pt={[6]}>
        <ContactForm />
      </Box>
    </>
  )
}

export default injectIntl(About)

export const projectQuery = graphql`
  fragment sectionBannerFragment on ContentfulSectionBanner {
    id
    title
    animationReference
    shortText
    introBlurb {
      introBlurb
    }
  }

  query aboutPageQuery($language: String!) {
    page: contentfulPageAbout(slug: { eq: "about-us" }, node_locale: { eq: $language }) {
      id
      title
      slug
      node_locale
      seo {
        ...seoFragment
      }
      intro {
        ...sectionBannerFragment
      }
      teamIntro {
        ...sectionBannerFragment
      }
      teamMembers {
        id
        fullName
        title
        photo {
          fluid {
            srcSet
          }
        }
      }
      processIntro {
        ...sectionBannerFragment
      }
      processes {
        id
        title
        text {
          text
        }
      }
      servicesIntro {
        ...sectionBannerFragment
      }
      services {
        id
        title
        description {
          description
        }
        slug
      }
      clientsIntro {
        ...sectionBannerFragment
      }
    }
  }
`
