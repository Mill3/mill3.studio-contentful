import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl } from 'react-intl'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'

import { AboutSectionHeading } from '@components/about'
import ContactForm from '@components/contact/ContactForm'
import ContactTicker from '@components/contact/ContactTicker'
import { HORIZONTAL_SPACER, VERTICAL_SPACER } from '@components/content_rows'
import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import SEO from '@components/seo'
import { TRANSITION_PANE_STATES } from '@components/transitions'
import { breakpoints, header } from '@styles/Theme'
import { TRANSITION_INTRO_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'


const Header = styled.header`
  margin-top: ${header.height * -1}px;
  padding-top: ${header.height}px;

  @media (min-width: ${breakpoints[2]}) {
    margin-top: ${(header.height + 24) * -1}px;
    padding-top: ${header.height + 24}px;
  }
`

const Contact = ({ data, intl }, { layoutState }) => {
  useEffect(() => {
    if( !layoutState.invertedHeader ) layoutState.setHeaderInverted(true) // eslint-disable-next-line react-hooks/exhaustive-deps
    if( layoutState.invertedBody ) layoutState.setBodyInverted(false) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { transitionState } = layoutState
  const delay = transitionState === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY : TRANSITION_IN_DELAY

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
              <AnimatedHtmlTitle startDelay={delay + 800} source={intl.formatMessage({ id: 'contact.ContactIntroLine2' })} />
            </AboutSectionHeading>
          </Box>

        </Flex>

        <ContactTicker py={[4, null, 5]} />
      </Box>

      <ContactForm px={[24, 4, 0]}expandable={false} opened={true} />

    </>
  )
}

Contact.contextTypes = {
  layoutState: PropTypes.object,
}

export default injectIntl(Contact)

export const contactQuery = graphql`
  query contactQuery($locale: String!) {
    seoFields : contentfulSeo(slug: { eq: "contact" }, node_locale : { eq: $locale }) {
      ...seoFragment
    }
  }
`
