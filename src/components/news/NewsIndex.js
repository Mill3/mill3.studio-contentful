import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { Flex, Box, Text } from 'rebass'

import Layout from '@components/layout'
import Container from '@styles/Container'
import NewsPreview from '@components/news/NewsPreview'


class NewsIndex extends Component {

  list() {

    const columns = {
      width: [1,1/2,1/3,1/3],
    }

    if (this.props.data) {
      return this.props.data.allContentfulNews.edges.map((news, index) =>
        <NewsPreview key={index} index={index} news={news} columns={columns} />
      )
    }
  }

  render() {
    return (
      <Layout locale={this.props.pageContext.locale}>
        <Container>
          <Flex as={`header`} flexWrap={`wrap`} justifyContent={`center`} mt={[3,3,6]} mb={[3,3,6]}>
            <Text as={`h1`} fontSize={[4,4,5,6]} className={`fw-300`} mb={[3]}><em>Unformal</em>, long form.</Text>
            <Text as={`h2`} pl={[2,4,6,`10vw`,'24vw']} pr={[2,4,6,`10vw`,'24vw']} className={`is-center`}>
              Reading is good for you. Don’t stress, we’ve added images too.
            </Text>
          </Flex>
          <Flex as={`section`} flexWrap={`wrap`}>
            {this.list()}
          </Flex>
        </Container>
      </Layout>
    );
  }
}

export default NewsIndex

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
