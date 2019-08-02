import React, { Component } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Flex, Text } from 'rebass'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import SEO from '@components/seo'
import TransitionContainer from '@components/transitions/TransitionContainer'
import HeaderCircle from '@components/header/HeaderCircle'
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

class NewsIndex extends Component {

  list() {

    const columns = {
      width: [1, 1, 1/2],
    }
    const isMobile = Viewport.width < mobileBreakpoint

    const getOffset = (index) => {
      if( isMobile ) return 0
      else return new ResponsiveProp([
        null,
        null,
        index % 2 === 1 ? -160 : 0,
      ])
    }
    const getDelay = (index) => {
      if( isMobile ) return index === 0 ? TRANSITION_DURATION : 0
      else return new ResponsiveProp([
        null,
        null,
        ((index % 2) + 1) * 125 + (index < 2 ? 250 : 0)
      ])
    }

    if (this.props.data) {
      return this.props.data.allContentfulNews.edges.map((news, index) => {
        const offset = getOffset(index)
        const delay = getDelay(index)

        return (
          <NewsPreview
            key={index}
            index={index}
            delay={delay}
            news={news}
            columns={columns}
            offset={offset}
          />
        )
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        <SEO title={`nav.Journal`} translate={true} />
        <Container fluid>
          <Flex as={NewsIndexIntro} flexDirection="column" justifyContent="center" pb={[4, null, 3]} className="is-relative">
            <TransitionContainer autoCalculateDelay={false} index={1}>
              <Text as={`h1`} fontSize={['6.763285024vw', null, '6vw', '3.611111111vw']} className={`fw-900`} mb={['6vw', null, '2vw']} textAlign={`center`}>
                <FormattedHTMLMessage id="news.index.title" />
              </Text>
            </TransitionContainer>
            <TransitionContainer  autoCalculateDelay={false} index={1.5}>
              <Text as={`h3`} fontSize={['4.830917874vw', null, '2.75vw', '1.805555556vw']} width={['80%', null, '75vw']} mx={'auto'} mb={0} textAlign={`center`}>
                <FormattedMessage id="news.index.subtitle" />
              </Text>
            </TransitionContainer>

            <HeaderCircle ml={['-5vw', null, -3, '-28px']} css={{transform: 'translateY(45%)'}} />
          </Flex>

          <Flex as={ListGridStyle} flexWrap={`wrap`} mx={[-2, null, -3, '-28px']}>
            {this.list()}
          </Flex>
        </Container>
      </React.Fragment>
    );
  }
}

export default injectIntl(NewsIndex)

export const newsQuery = graphql`
  query allNewsQuery($locale: String!) {
    allContentfulNews(filter: { node_locale : { eq: $locale }}) {
      edges {
        node {
          ...News
        }
      }
    }
  }
`
