import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl } from 'gatsby-plugin-intl'
import styled from 'styled-components'
import { Box, Flex, Text } from 'rebass'

import { LayoutContext } from '@layouts/layoutContext'

import CodePreview from '@components/codes/CodePreview'
import ContactForm from '@components/contact/ContactForm'
import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import NewsPreview from '@components/news/NewsPreview'
import { TRANSITION_PANE_STATES } from '@components/transitions'
import SEO from '@components/seo'
import Container from '@styles/Container'
import { breakpoints, header } from '@styles/Theme'
import { TRANSITION_DURATION, TRANSITION_INTRO_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'


const mobileBreakpoint = parseInt(breakpoints[1])

const DATA = [{
  url: "https://www.npmjs.com/package/mill3-wp-boilerplate",
  name: "Mill3 WP Webpack/Twig Boilerplate",
  description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas."
}, {
  url: "https://github.com/Mill3/mill3-packages/tree/master/packages/system-ui-sass",
  name: "System UI Sass",
  description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas."
}, {
  url: "https://github.com/Mill3/mill3-packages/tree/master/packages/barba-scripts",
  name: "@Barba/scripts",
  description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas."
}]


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


const Packages = () => {
  return (
    <Flex
      as={Grid}
      flexDirection={['column', null, 'row']}
      flexWrap={'wrap'}
      m={0}
      mx={[null, null, '-4.557291667vw', '-3.528225806vw', '-2.430555556vw']}
      p={0}
      py={[20, null, 25]}
    >
      {DATA.map((data, index) => (
        <Flex
          key={index}
          as="li"
          width={[1, null, 1/2, 1/3]}
          px={[null, null, '4.557291667vw', '3.528225806vw', '2.430555556vw']}
          mb={[30, null, '9.765625vw', '7.560483871vw', '5.208333333vw']}
        >
          <CodePreview url={data.url} name={data.name} description={data.description} />
        </Flex>
      ))}
    </Flex>
  )
}
const Articles = ({ data }) => {
  const columns = {
    width: [1, null, 1 / 2],
  }
  const isMobile = Viewport.width < mobileBreakpoint

  const getDelay = index => {
    if (isMobile) return index === 0 ? TRANSITION_DURATION : 0
    else return new ResponsiveProp([null, null, ((index % 2) + 1) * 125 + (index < 2 ? 250 : 0)])
  }

  return (
    <Flex
      as={Grid}
      flexDirection={['column', null, 'row']}
      flexWrap={'wrap'}
      m={0}
      mx={[-2, null, -3, '-28px']}
      p={0}
      pb={[40, null, 90]}
    >
      {data.map((news, index) =>
        <NewsPreview key={index} index={index} news={news} columns={columns} delay={getDelay(index)} />
      )}
    </Flex>
  )
}

const OpenCode = ({ data, intl }) => {
  const { dispatch, layoutState } = useContext(LayoutContext)
  useEffect(() => {
    if( !layoutState.invertedHeader ) dispatch({type: "header.invert"}) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutState])

  const { transition } = layoutState
  const delay = transition.state === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY : TRANSITION_IN_DELAY

  return (
    <>
      <SEO seo={data.seoFields} url={`open-source/`} />

      <Box as={Header} bg="black" color="white">
        <Container
          fluid
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          pt={["70px", null, "170px"]}
          pb={["70px", null, "170px", 6]}
        >

          <Text
            as={Title}
            fontFamily="serif"
            fontSize={['6.763285024vw', null, '5.2vw', '5.241935484vw', '3.611111111vw']}
            fontWeight="300"
            lineHeight={[1.178571429, null, null, 1.538461538]}
            textAlign="center"
          >
            <AnimatedHtmlTitle startDelay={delay} source={intl.formatMessage({ id: 'opensource.title' })} />
          </Text>

          <Text
            as="p"
            m={0}
            mt={[3, null, 4, 2]}
            mx="auto"
            p={0}
            maxWidth={[null, null, '58vw', '75vw', '50vw']}
            fontSize={['4.830917874vw', null, '3.125vw', '2.419354839vw', '1.666666667vw']}
            lineHeight={[1.5]}
            textAlign="center"
          >
            {intl.formatMessage({ id: 'opensource.description' })}
          </Text>

        </Container>
      </Box>

      <Box as="section" bg="black" color="white">
        <Container fluid={true}>
          <Packages />
        </Container>
      </Box>

      <Box as="aside">
        <Container fluid={true}>
          <Text
            as="h2"
            fontSize={['5.797101449vw', null, '3.645833333vw', '2.822580645vw', '1.944444444vw']}
            fontWeight="300"
            lineHeight={[1.2]}
            m={0}
            p={0}
            py={[50]}
          >
            {intl.formatMessage({ id: 'opensource.articles' })}
          </Text>

          <Articles data={data?.articles?.edges} />
        </Container>
      </Box>

      <ContactForm />
    </>
  )
}

export default injectIntl(OpenCode)

export const openCodeQuery = graphql`
  query openCodeQuery($language: String!) {
    seoFields : contentfulSeo(slug: { eq: "open-source" }, node_locale : { eq: $language }) {
      ...seoFragment
    }
    articles : allContentfulNews(limit: 2, filter: { node_locale: { eq: $language }, visibleOnlyOnLocale: { eq: $language } }) {
      edges {
        node {
          ...News
        }
      }
    }
  }
`
