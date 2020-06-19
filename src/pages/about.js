import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Box } from 'rebass'
import { injectIntl, FormattedMessage } from 'gatsby-plugin-intl'

import { LayoutContext } from '@layouts/layoutContext'

import SEO from '@components/seo'

import AboutIntro from '@components/about/AboutIntro'
import AboutTeam from '@components/about/AboutTeam'
import AboutProcess from '@components/about/AboutProcess'
import AboutServices from '@components/about/AboutServices'
import AboutClients from '@components/about/AboutClients'
import ContactForm from '@components/contact/ContactForm'

import { AnimatedBackgroundRowContainer, HORIZONTAL_SPACER } from '@components/content_rows'

class About extends Component {

  static contextType = LayoutContext

  constructor(props) {
    super(props)
    this.state = {}
    this.setBodyInverted = this.setBodyInverted.bind(this)
  }

  setBodyInverted(inView) {
    const { dispatch } = this.context
    if(inView === true) {
      dispatch({type: "header.invert"})
      dispatch({type: "body.invert"})
    } else {
      dispatch({type: "body.reset"})
      dispatch({type: "header.reset"})
    }
  }

  render() {
    const { data } = this.props
    const { layoutState } = this.context
    const { page } = data
    const color = layoutState.invertedBody ? `#fff` : `#000`

    return (
      <>
        {page.seo && <SEO seo={page.seo} url={`${page.slug}/`} />}

        <Box px={HORIZONTAL_SPACER}>

          <AnimatedBackgroundRowContainer wrapper={Box} onChange={this.setBodyInverted} backgroundColor={`transparent`} threshold={0.15}>
            <React.Fragment>
              {/* the intro */}
              <AboutIntro data={page.intro} />

              {/* Team */}
              <AboutTeam
                data={{ teamIntro: page.teamIntro, teamMembers: page.teamMembers }}
                color={color}
              />
            </React.Fragment>
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

          <AboutClients data={{ clientsIntro: page.clientsIntro }} />

        </Box>

        <Box pt={[6]}>
          <ContactForm />
        </Box>

      </>
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
