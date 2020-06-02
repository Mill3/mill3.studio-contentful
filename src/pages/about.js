import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl } from 'react-intl'
import { Box } from 'rebass'

import LayoutContext from '@components/contexts/LayoutContext'

import SEO from '@components/seo'
import ClientsFooter from '@components/clients/ClientsFooter'
// import { BodyInvertedTriggerWrapper } from '@components/pages/about'
import AboutIntro from '@components/pages/about/AboutIntro'
import AboutTeam from '@components/pages/about/AboutTeam'
import AboutProcess from '@components/pages/about/AboutProcess'
import AboutServices from '@components/pages/about/AboutServices'
import AboutClients from '@components/pages/about/AboutClients'
import ContactForm from '@components/contact/ContactForm'

import { AnimatedBackgroundRowContainer } from '@components/content_rows'

class About extends Component {
  static contextTypes = {
    layoutState: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.setBodyInverted = this.setBodyInverted.bind(this)
  }

  componentDidMount() {
    this.context.layoutState.setHeaderInverted(true)
  }

  componentWillUnmount() {
    this.context.layoutState.setHeaderInverted(false)
  }

  setBodyInverted(inView) {
    console.log('inView:', inView)
    this.context.layoutState.setBodyInverted(inView)
  }

  render() {
    const { data, intl } = this.props
    const { layoutState } = this.context
    const { page } = data

    return (
      <LayoutContext.Provider>
        {page.seo && <SEO seo={page.seo} url={`${page.slug}/`} />}

        <AnimatedBackgroundRowContainer onChange={this.setBodyInverted} backgroundColor={`transparent`} threshold={0.25}>
          {({ inView }) => (
            <Box>
              {/* the intro */}
              <AboutIntro data={page.intro} inView={inView} color={`currentColor`} />

              {/* Team */}
              <AboutTeam
                data={{ teamIntro: page.teamIntro, teamMembers: page.teamMembers }}
                inView={inView}
                color={`currentColor`}
              />
            </Box>
          )}
        </AnimatedBackgroundRowContainer>

        <AboutProcess
          data={{ processIntro: page.processIntro, processes: page.processes }}
          color={`currentColor`}
        />

        <AnimatedBackgroundRowContainer onChange={this.setBodyInverted} backgroundColor={`transparent`} threshold={0.25}>
          <AboutServices
            data={{ servicesIntro: page.servicesIntro, services: page.services }}
            color="currentColor"
          />
        </AnimatedBackgroundRowContainer>

        <AboutClients data={{ clientsIntro: page.clientsIntro }} color="currentColor" />

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
