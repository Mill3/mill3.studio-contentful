import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Flex, Text } from 'rebass'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'gatsby-plugin-intl'

import SEO from '@components/seo'
import TransitionContainer from '@components/transitions/TransitionContainer'
import NewsPreview from '@components/news/NewsPreview'
import Container from '@styles/Container'
import { breakpoints } from '@styles/Theme'
import { TRANSITION_DURATION } from '@utils/constants'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'

const mobileBreakpoint = parseInt(breakpoints[1])

const NewsIndexIntro = styled.header`
  min-height: 50vh;
`
const ListGridStyle = styled.section`
  position: relative;
`

const NewsList = ({ articles = [] }) => {
  const columns = {
    width: [1, 1, 1 / 2],
  }
  const isMobile = Viewport.width < mobileBreakpoint

  const getOffset = index => {
    if (isMobile) return 0
    else return new ResponsiveProp([null, null, index % 2 === 1 ? -160 : 0])
  }
  const getDelay = index => {
    if (isMobile) return index === 0 ? TRANSITION_DURATION : 0
    else return new ResponsiveProp([null, null, ((index % 2) + 1) * 125 + (index < 2 ? 250 : 0)])
  }


  return articles.map((news, index) => {
    const offset = getOffset(index)
    const delay = getDelay(index)

    return <NewsPreview key={index} index={index} delay={delay} news={news} columns={columns} offset={offset} />
  })
}

const NewsIndex = ({ data }) => {
  return (
    <>
      <SEO title={`nav.Journal`} translate={true} url={`journal/`} />

      <Container fluid>
        <Flex
          as={NewsIndexIntro}
          flexDirection="column"
          justifyContent="center"
          pb={[4, null, 3]}
          className="is-relative"
        >
          <TransitionContainer autoCalculateDelay={false} index={1}>
            <Text
              as={`h1`}
              textAlign="center"
              fontSize={['11.594202899vw', null, 5, '3.611111111vw']}
              lineHeight={'1.2'}
              mt={[3, null, 0]}
              mb={0}
            >
              <FormattedHTMLMessage id="news.index.title" />
            </Text>
          </TransitionContainer>
          <TransitionContainer autoCalculateDelay={false} index={1.5}>
            <Text
              as={`h3`}
              textAlign="center"
              fontSize={['5.75vw', '3.8vw', '2.8vw', '1.805vw']}
              pt={['24px', null, 4]}
              px={[0,0,0,0,`10vw`]}
              mb={0}
            >
              <FormattedMessage id="news.index.subtitle" />
            </Text>
          </TransitionContainer>

          {/* <HeaderCircle ml={['-5vw', null, -3, '-28px']} css={{ transform: 'translateY(45%)' }} /> */}
        </Flex>

        <Flex as={ListGridStyle} flexWrap={`wrap`} mx={[-2, null, -3, '-28px']}>
          <NewsList articles={data?.allContentfulNews?.edges} />
        </Flex>
      </Container>
    </>
  )
}

export default injectIntl(NewsIndex)

export const newsQuery = graphql`
  query allNewsQuery($language: String!) {
    allContentfulNews(filter: { node_locale: { eq: $language }, visibleOnlyOnLocale: { eq: $language } }) {
      edges {
        node {
          ...News
        }
      }
    }
  }
`
