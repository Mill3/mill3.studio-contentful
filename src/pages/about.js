import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Box } from 'rebass'

import LayoutContext from '@components/contexts/LayoutContext'

import SEO from '@components/seo'
import ClientsFooter from '@components/clients/ClientsFooter'
// import { BodyInvertedTriggerWrapper } from '@components/pages/about'
import AboutIntro from '@components/about/AboutIntro'
import AboutTeam from '@components/about/AboutTeam'
import AboutProcess from '@components/about/AboutProcess'
import AboutServices from '@components/about/AboutServices'
import AboutClients from '@components/about/AboutClients'
import ContactForm from '@components/contact/ContactForm'

import { AnimatedBackgroundRowContainer, HORIZONTAL_SPACER } from '@components/content_rows'

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
    this.context.layoutState.setBodyInverted(false)
  }

  setBodyInverted(inView) {
    this.context.layoutState.setBodyInverted(inView)
  }

  render() {
    const { data } = this.props
    const { layoutState } = this.context
    const { page } = data
    const color = layoutState.invertedBody ? `#fff` : `#000`

    return (
      <LayoutContext.Provider>
        {page.seo && <SEO seo={page.seo} url={`${page.slug}/`} />}

        <Box px={HORIZONTAL_SPACER}>

          <AnimatedBackgroundRowContainer wrapper={Box} onChange={this.setBodyInverted} backgroundColor={`transparent`} threshold={0.25}>
            {({ inView }) => (
              <React.Fragment>
                {/* the intro */}
                <AboutIntro data={page.intro} color={color} />

                {/* Team */}
                <AboutTeam
                  data={{ teamIntro: page.teamIntro, teamMembers: page.teamMembers }}
                  color={color}
                />
              </React.Fragment>
            )}
          </AnimatedBackgroundRowContainer>

          <AboutProcess
            data={{ processIntro: page.processIntro, processes: page.processes }}
            color={color}
          />

          <AnimatedBackgroundRowContainer wrapper={Box} onChange={this.setBodyInverted} backgroundColor={`transparent`} threshold={0.5}>
            <AboutServices
              data={{ servicesIntro: page.servicesIntro, services: page.services }}
              color={color}
            />
          </AnimatedBackgroundRowContainer>

          <AboutClients data={{ clientsIntro: page.clientsIntro }} color={color} />


        </Box>

        <ClientsFooter />

        <Box pt={[6]}>
          <ContactForm />
        </Box>

      </LayoutContext.Provider>
    )
  }
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
