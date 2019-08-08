import React from 'react'
import { graphql } from 'gatsby'
// import { Box, Flex, Text } from 'rebass'

import SEO from '@components/seo'
import { ChipButton } from '@components/buttons'
import ClientsTicker from '@components/clients/ClientsTicker'
import ClientsList from '@components/clients/ClientsList'
import Container from '@styles/Container'
import PageSingle from '@components/pages/PageSingle'

const About = ({ pageContext, data }) => (
  <React.Fragment>

    <PageSingle data={ data } />

    <Container fluid css={{position: 'relative'}}>
      <ChipButton css={{position: 'absolute', zIndex: 3, top: '100%', right: 0, marginTop: -30}}>Show list</ChipButton>
    </Container>

    <ClientsTicker quantity={5} />

  </React.Fragment>
);

export default About

export const projectQuery = graphql`
  query aboutPageQuery($locale: String!) {
    page: contentfulPages(slug: { eq: "about" }, node_locale : { eq: $locale }) {
      ...PageSingle
    }
  }
`
