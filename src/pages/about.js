import React from 'react'
import { graphql } from 'gatsby'
import { injectIntl } from 'react-intl'
import { Box } from 'rebass'
import styled from 'styled-components'

import SEO from '@components/seo'
import ClientsFooter from '@components/clients/ClientsFooter'
import AboutIntro from '@components/pages/about/AboutIntro'
import AboutTeam from '@components/pages/about/AboutTeam'
import AboutProcess from '@components/pages/about/AboutProcess'
import AboutServices from '@components/pages/about/AboutServices'
import AboutClients from '@components/pages/about/AboutClients'
import ContactForm from '@components/contact/ContactForm'

// import TransitionContainer from '@components/transitions/TransitionContainer'
import {
  AnimatedBackgroundRowContainer,
  AnimatedBackgroundContainer,
  VERTICAL_SPACER,
  BOTTOM_SPACER,
} from '@components/content_rows'

const About = ({ data, intl }) => {
  const { page } = data
  console.log('page:', page)

  return (
    <React.Fragment>
      {page.seo && <SEO seo={page.seo} url={`${page.slug}/`} />}

      {/* black wrapper for 2 first section */}
      <AnimatedBackgroundContainer backgroundColor={'#000'} threshold={0.5}>

        {/* the intro */}
        <AboutIntro data={page.intro} color="#fff" />

      </AnimatedBackgroundContainer>

      <AnimatedBackgroundContainer backgroundColor={'red'} threshold={0.5}>

        {/* Team */}
        <AboutTeam
          data={{ teamIntro: page.teamIntro, teamMembers: page.teamMembers }}
          color="#fff"
        />

      </AnimatedBackgroundContainer>

      <AboutProcess
        data={{ processIntro: page.processIntro, processes: page.processes }}
      />

      <AnimatedBackgroundRowContainer backgroundColor={'#000'} threshold={0.5}>

        <AboutServices
          data={{ servicesIntro: page.servicesIntro, services: page.services }}
          color="#fff"
        />

      </AnimatedBackgroundRowContainer>

      <AboutClients data={{ clientsIntro: page.clientsIntro }} />

      <ClientsFooter />

      <Box pt={[6]}>
        <ContactForm />
      </Box>
    </React.Fragment>
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
            base64
            tracedSVG
            srcWebp
            srcSetWebp
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
        text {
          id
          text
        }
      }
      clientsIntro {
        ...sectionBannerFragment
      }
    }
  }
`
