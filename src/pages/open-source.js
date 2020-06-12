import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl } from 'react-intl'
import styled from 'styled-components'
import { Box, Flex, Text } from 'rebass'

import CodePreview from '@components/codes/CodePreview'
import ContactForm from '@components/contact/ContactForm'
import { VERTICAL_SPACER } from '@components/content_rows'
import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import { TRANSITION_PANE_STATES } from '@components/transitions'
import SEO from '@components/seo'
import Container from '@styles/Container'
import { breakpoints, header, space } from '@styles/Theme'
import { TRANSITION_INTRO_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'


const Header = styled.header`
  margin-top: ${header.height * -1}px;
  padding-top: ${header.height}px;

  @media (min-width: ${breakpoints[2]}) {
    margin-top: ${(header.height + 24) * -1}px;
    padding-top: ${header.height + 24}px;
  }
`
const Title = styled.h1`
  strong, b {
    font-family: ${props => props.theme.fonts.sans};
    font-weight: normal;
  }
`
const Grid = styled.ul`
  list-style: none;
`


const OpenCode = ({ data, intl }, { layoutState }) => {
  useEffect(() => {
    if( !layoutState.invertedHeader ) layoutState.setHeaderInverted(true) // eslint-disable-next-line react-hooks/exhaustive-deps
    if( layoutState.invertedBody ) layoutState.setBodyInverted(false) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { transitionState } = layoutState
  const delay = transitionState === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY : TRANSITION_IN_DELAY

  return (
    <>
      <SEO seo={data.seoFields} url={`open-source/`} />

      <Box as={Header} bg="black" color="white">
        <Container
          fluid
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          py={VERTICAL_SPACER}
          minHeight={['65vh', null, 0]}
        >

          <Text
            as={Title}
            fontFamily="serif"
            fontSize={['8.2vw', null, '6.5vw', '3.611111111vw']}
            fontWeight="300"
            lineHeight={1.5}
            textAlign="center"
          >
            <AnimatedHtmlTitle startDelay={delay} source={intl.formatMessage({ id: 'opensource.title' })} />
          </Text>

          <Text as="p" m={0} mt={[3]} mx="auto" p={0} maxWidth={[null, null, null, 800]} fontSize={[24]} textAlign="center">
            {intl.formatMessage({ id: 'opensource.description' })}
          </Text>

        </Container>
      </Box>

      <Box as="section" bg="black" color="white">
        <Container fluid={true} py={[25]}>
          <Flex as={Grid} flexDirection={['column', null, 'row']} flexWrap={'wrap'} mx={[-12, space[3] * -0.5, '-2.5vw']} p={0}>
            <Box as="li" width={[1, null, 1/2, 1/3]} px={[12, 3, '2.5vw']} mb={[24, 4, '5vw']}>
              <CodePreview />
            </Box>

            <Box as="li" width={[1, null, 1/2, 1/3]} px={[12, 3, '2.5vw']} mb={[24, 4, '5vw']}>
              <CodePreview />
            </Box>

            <Box as="li" width={[1, null, 1/2, 1/3]} px={[12, 3, '2.5vw']} mb={[24, 4, '5vw']}>
              <CodePreview />
            </Box>

            <Box as="li" width={[1, null, 1/2, 1/3]} px={[12, 3, '2.5vw']} mb={[24, 4, '5vw']}>
              <CodePreview />
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box as="aside">
        <Container fluid={true} py={[100]}>
        </Container>
      </Box>

      <ContactForm />
    </>
  )
}

OpenCode.contextTypes = {
  layoutState: PropTypes.object,
}

export default injectIntl(OpenCode)

export const openCodeQuery = graphql`
  query openCodeQuery($locale: String!) {
    seoFields : contentfulSeo(slug: { eq: "open-source" }, node_locale : { eq: $locale }) {
      ...seoFragment
    }
  }
`
