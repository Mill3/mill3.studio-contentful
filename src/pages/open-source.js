import React, { useEffect, useContext } from 'react'
import { graphql } from 'gatsby'
import { injectIntl } from 'gatsby-plugin-intl'
import styled from 'styled-components'
// import posed from 'react-pose'
import { Box, Flex, Text } from 'rebass'


import CodePreview from '@components/codes/CodePreview'
import InViewCodePreview from '@components/codes/InViewCodePreview'
import ContactForm from '@components/contact/ContactForm'
import AnimatedHtmlTitle from '@components/elements/AnimatedHtmlTitle'
import NewsPreview from '@components/news/NewsPreview'
import SEO from '@components/seo'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { LayoutContext } from '@layouts/layoutContext'
import Container from '@styles/Container'
import { breakpoints, header, space } from '@styles/Theme'
import { TRANSITION_PANE_STATES, TRANSITION_DURATION, INTRO_REVEALS_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'

const mobileBreakpoint = parseInt(breakpoints[1])
const tabletBreakpoint = parseInt(breakpoints[2])

const DATA = [{
  url: "https://www.npmjs.com/package/@mill3-packages/wp-boilerplate",
  name: "Wordpress Theme Boilerplate with Webpack",
  description: "code.wp-boilerplate"
}, {
  url: "https://www.npmjs.com/package/@mill3-packages/system-ui-sass",
  name: "System UI Sass",
  description: "code.system-ui-sass"
}, {
  url: "https://www.npmjs.com/package/@mill3-packages/barba-scripts",
  name: "@barba-scripts",
  description: "code.barba-scripts"
}, {
  url: "https://www.npmjs.com/package/@mill3-packages/breakpoints-observer",
  name: "@breakpoints-observer",
  description: "code.breakpoints-observer"
}]

const Header = styled.header`
  margin-top: ${(header.height + space[6]) * -1}px;
  padding-top: ${header.height + space[6]}px;

  @media (min-width: ${breakpoints[2]}) {
    margin-top: ${(header.height + space[6] + 24) * -1}px;
    padding-top: ${header.height + space[6] + 24}px;
  }
`
const Title = styled.h1`
  strong,
  b {
    font-family: ${props => props.theme.fonts.sans};
    font-weight: normal;
  }
`
const Grid = styled.ul`
  list-style: none;
`

const Packages = injectIntl(({ delayIn = 0, delayOut = 0, intl }) => {
  const isMobile = Viewport.width < mobileBreakpoint
  const isTablet = Viewport.width < tabletBreakpoint

  const getDelayIn = index => {
    if (isMobile) return index === 0 ? delayIn : 50
    else if( isTablet ) return index % 2 * 250 + (index < 2 ? delayIn : 0)
    else return index % 3 * 250 + (index < 3 ? delayIn : 0)
  }

  const getDelayOut = index => {
    if (isMobile) return delayOut
    else if( isTablet ) return index % 2 * 50 + delayOut
    else return index % 3 * 50 + delayOut
  }

  const getThreshold = index => {
    if (isMobile) return index === 0 ? 0 : 0.25
    else if (isTablet) return index < 2 ? 0 : 0.25
    else return index < 3 ? 0 : 0.25
  }

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
          width={[1, null, 1 / 2, 1 / 3]}
          px={[null, null, '4.557291667vw', '3.528225806vw', '2.430555556vw']}
          mb={[30, null, '9.765625vw', '7.560483871vw', '5.208333333vw']}
        >
          <InViewCodePreview delayIn={getDelayIn(index)} delayOut={getDelayOut(index)} threshold={getThreshold(index)}>
            <CodePreview url={data.url} name={data.name} description={intl.formatMessage({id: data.description})} />
          </InViewCodePreview>
        </Flex>
      ))}
    </Flex>
  )
})

const Articles = ({ data, delay = 0 }) => {
  const columns = {
    width: [1, null, 1 / 2],
  }
  const isMobile = Viewport.width < mobileBreakpoint

  const getDelay = index => {
    if (isMobile) return index === 0 ? delay : 0
    else return index % 2 * 250 + (index < 2 ? delay : 0)
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
      {data.map((news, index) => (
        <NewsPreview key={index} index={index} news={news} columns={columns} delay={getDelay(index)} />
      ))}
    </Flex>
  )
}

const OpenCode = ({ data, intl, location }) => {
  const { dispatch, layoutState } = useContext(LayoutContext)
  const { transition } = layoutState
  const delay = transition.state === TRANSITION_PANE_STATES['intro'] ? INTRO_REVEALS_DELAY : TRANSITION_IN_DELAY

  useEffect(() => {
    if (!layoutState.invertedHeader) dispatch({ type: 'header.invert' }) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <>
      <SEO seo={data.seoFields} url={`open-source/`} />

      <Box as={Header} bg="black" color="white">
        <Container
          fluid
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          pt={['70px', null, '170px']}
          pb={['70px', null, '170px', 6]}
        >
          <TransitionContainer>
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
          </TransitionContainer>

          <TransitionContainer
            mt={[3, null, 4, 2]}
            mx="auto"
            maxWidth={[null, null, '58vw', '75vw', '50vw']}
            delayIn={delay + 1250}
            autoCalculateDelay={false}
          >
            <Text
              as="p"
              m={0}
              p={0}
              fontSize={['4.830917874vw', null, '3.125vw', '2.419354839vw', '1.666666667vw']}
              lineHeight={[1.5]}
              textAlign="center"
            >
              {intl.formatMessage({ id: 'opensource.description' })}
            </Text>
          </TransitionContainer>
        </Container>
      </Box>

      <Box as="section" bg="black" color="white">
        <Container fluid={true}>
          <Packages delayIn={delay + 1050} delayOut={TRANSITION_IN_DELAY / 4} />
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
            <AnimatedHtmlTitle startDelay={0} source={ `<span>${intl.formatMessage({ id: 'opensource.articles' })}</span>` } />
          </Text>

          <Articles data={data?.articles?.edges} delay={500} />
        </Container>
      </Box>

      <ContactForm />
    </>
  )
}

export default injectIntl(OpenCode)

export const openCodeQuery = graphql`
  query openCodeQuery($language: String!) {
    seoFields: contentfulSeo(slug: { eq: "open-source" }, node_locale: { eq: $language }) {
      ...seoFragment
    }
    articles: allContentfulNews(
      limit: 2
      filter: { node_locale: { eq: $language }, visibleOnlyOnLocale: { eq: $language } }
    ) {
      edges {
        node {
          ...News
        }
      }
    }
  }
`
