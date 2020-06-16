import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Box } from 'rebass'

import AboutIntro from '@components/about/AboutIntro'
import AboutTeam from '@components/about/AboutTeam'
import AboutProcess from '@components/about/AboutProcess'
import AboutServices from '@components/about/AboutServices'
import AboutClients from '@components/about/AboutClients'
import ContactForm from '@components/contact/ContactForm'
import SEO from '@components/seo'

import { AnimatedBackgroundRowContainer } from '@components/content_rows'
import ResponsiveProp from '@utils/ResponsiveProp'


const HEADER_INVIEW_THRESHOLD = new ResponsiveProp([0.1, null, 0.25])
const SERVICES_INVIEW_THRESHOLD = new ResponsiveProp([0.2, null, 0.5])


const About = ({ data }, { layoutState }) => {
  const { page } = data
  const color = layoutState.invertedBody ? `#fff` : `#000`
  const setBodyInverted = (inView) => {
    layoutState.setHeaderInverted(inView)
    layoutState.setBodyInverted(inView)
  }

  return (
    <>
      {page.seo && <SEO seo={page.seo} url={`${page.slug}/`} />}

      <Box>

        <AnimatedBackgroundRowContainer wrapper={Box} onChange={setBodyInverted} backgroundColor={`transparent`} threshold={HEADER_INVIEW_THRESHOLD.getValue()}>
          <>
            {/* the intro */}
            <AboutIntro data={page.intro} />

            {/* Team */}
            <AboutTeam
              data={{ teamIntro: page.teamIntro, teamMembers: page.teamMembers }}
              color={color}
            />
          </>
        </AnimatedBackgroundRowContainer>

        <AboutProcess
          data={{ processIntro: page.processIntro, processes: page.processes }}
          color={color}
        />

        <AnimatedBackgroundRowContainer wrapper={Box} onChange={setBodyInverted} backgroundColor={`transparent`} threshold={SERVICES_INVIEW_THRESHOLD.getValue()}>
          <AboutServices
            data={{ servicesIntro: page.servicesIntro, services: page.services }}
            color={color}
          />
        </AnimatedBackgroundRowContainer>

        <AboutClients data={{ clientsIntro: page.clientsIntro }} />

      </Box>

      <Box pt={[6]}>
        <ContactForm />
      </Box>

    </>
  )
}

About.contextTypes = {
  layoutState: PropTypes.object,
}

export default About

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

  query aboutPageQuery($locale: String!) {
    page: contentfulPageAbout(slug: { eq: "about-us" }, node_locale: { eq: $locale }) {
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
