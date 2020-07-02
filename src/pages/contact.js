import React, { useContext, useEffect } from 'react'
import { graphql } from 'gatsby'
import { injectIntl } from 'gatsby-plugin-intl'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'


import { AboutSectionHeading } from '@components/about'
import ContactForm from '@components/contact/ContactForm'
import ContactTicker from '@components/contact/ContactTicker'
import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import SEO from '@components/seo'
import { LayoutContext } from '@layouts/layoutContext'
import { breakpoints, header } from '@styles/Theme'
import { TRANSITION_PANE_STATES, INTRO_REVEALS_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'


const Header = styled.header`
  margin-top: ${header.height * -1}px;
  padding-top: ${header.height}px;

  @media (min-width: ${breakpoints[2]}) {
    margin-top: ${(header.height + 24) * -1}px;
    padding-top: ${header.height + 24}px;
  }
`

const Contact = ({ data, intl }) => {
  const { dispatch, layoutState } = useContext(LayoutContext)
  const { transition } = layoutState
  const delay = transition.state === TRANSITION_PANE_STATES['intro'] ? INTRO_REVEALS_DELAY : TRANSITION_IN_DELAY

  useEffect(() => {
    dispatch({ type: "header.invert" })
  }, [])

  return (
    <>
      <SEO seo={data.seoFields} url={`contact/`} />

      <Box as={Header} bg="black" color="white">
        <Flex
          as="section"
          color="white"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          px={HORIZONTAL_SPACER}
          py={VERTICAL_SPACER}
          minHeight={['65vh', null, 0]}
        >

          <Box width={[1, null, 1, 0.9]}>
            <AboutSectionHeading heading={'h1'} textAlign="center">
              <AnimatedHtmlTitle startDelay={delay} source={intl.formatMessage({ id: 'contact.ContactIntroLine1' })} />
              <br />
              <AnimatedHtmlTitle startDelay={delay} source={intl.formatMessage({ id: 'contact.ContactIntroLine2' })} />
            </AboutSectionHeading>
          </Box>

        </Flex>

        <ContactTicker py={[4, null, 5]} />
      </Box>

      <ContactForm px={[24, 4, 0]} expandable={false} opened={true} />

    </>
  )
}

export default injectIntl(Contact)

export const contactQuery = graphql`
  query contactQuery($language: String!) {
    seoFields : contentfulSeo(slug: { eq: "contact" }, node_locale : { eq: $language }) {
      ...seoFragment
    }
  }
`
