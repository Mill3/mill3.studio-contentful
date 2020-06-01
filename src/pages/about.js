import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl } from 'react-intl'
import { Box } from 'rebass'

import LayoutContext from '@components/contexts/LayoutContext'

import SEO from '@components/seo'
import ClientsFooter from '@components/clients/ClientsFooter'
import AboutIntro from '@components/pages/about/AboutIntro'
import AboutTeam from '@components/pages/about/AboutTeam'
import AboutProcess from '@components/pages/about/AboutProcess'
import AboutServices from '@components/pages/about/AboutServices'
import AboutClients from '@components/pages/about/AboutClients'
import ContactForm from '@components/contact/ContactForm'

import { AnimatedBackgroundContainer } from '@components/content_rows'

class About extends Component {
  static contextTypes = {
    layoutState: PropTypes.object,
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.context.layoutState.setHeaderInverted(true)
  }

  componentWillUnmount() {
    this.context.layoutState.setHeaderInverted(false)
  }

  render() {
    const { data, intl } = this.props
    const { page } = data

    return (
      <LayoutContext.Provider inverted={true}>
        {page.seo && <SEO seo={page.seo} url={`${page.slug}/`} />}

        {/* black wrapper for 2 first section */}
        <AnimatedBackgroundContainer backgroundColor={'#000'} threshold={0.4}>
          {/* the intro */}
          <AboutIntro data={page.intro} color="#fff" />

          {/* Team */}
          <AboutTeam
            data={{ teamIntro: page.teamIntro, teamMembers: page.teamMembers }}
            color="#fff"
          />
        </AnimatedBackgroundContainer>

        <AboutProcess
          data={{ processIntro: page.processIntro, processes: page.processes }}
        />

        <AnimatedBackgroundContainer backgroundColor={'#000'} threshold={0.4}>
          <AboutServices
            data={{ servicesIntro: page.servicesIntro, services: page.services }}
            color="#fff"
          />
        </AnimatedBackgroundContainer>

        <AboutClients data={{ clientsIntro: page.clientsIntro }} />

        <ClientsFooter />

        <Box pt={[6]}>
          <ContactForm />
        </Box>
      </LayoutContext.Provider>
    )
  }
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
