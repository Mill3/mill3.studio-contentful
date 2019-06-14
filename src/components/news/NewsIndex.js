import React, { Component } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'

import Layout from '@components/layout'
import HeaderCircle from '@components/header/HeaderCircle'
import NewsPreview from '@components/news/NewsPreview'
import Container from '@styles/Container'

const ListGridStyle = styled.section`
  position: relative;
`;

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
        <Container fluid>
          <Box as={`header`} my={[3,3,6]}>
            <Text as={`h1`} fontSize={[4,5,6,7,7]} className={`fw-300`} mb={[3]} textAlign={`center`}>
              <em>Unformal</em>, long form.
            </Text>
            <Text as={`h3`} fontSize={[3,3,4]} px={[2,4,6,`10vw`,'14vw']} textAlign={`center`}>
              Reading is good for you. Don’t stress, we’ve added images too.
            </Text>
          </Box>

          <Flex as={ListGridStyle} flexWrap={`wrap`}>
            <HeaderCircle css={{bottom: '100%', marginBottom: '0.25vw', marginLeft: '-4.5vw'}} />

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
