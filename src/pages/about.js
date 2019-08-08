import React, { useState, useRef } from 'react'
import { graphql } from 'gatsby'
import { Box } from 'rebass'
// import {}

import SEO from '@components/seo'
import { ChipButton } from '@components/buttons'
import ClientsTicker from '@components/clients/ClientsTicker'
import ClientsList from '@components/clients/ClientsList'
import Container from '@styles/Container'
import PageSingle from '@components/pages/PageSingle'

const About = ({ pageContext, data }) => {
  const [list, setList] = useState(false);

  return (

    <React.Fragment>

      <PageSingle data={ data } />

      <Container fluid css={{position: 'relative'}}>

          <ChipButton onClick={(e) => setList(!list)} css={{position: 'absolute', zIndex: 3, top: '100%', right: '5vw', marginTop: -30}}>
            {!list ? 'Show list' : 'Show ticker'}
          </ChipButton>

      </Container>

      <Box pt={list ? [5] : [4]}>
        {/* show client list */}
        {list && <Container><ClientsList /></Container> }
        {/* show ticker */}
        {!list && <ClientsTicker quantity={5} /> }
      </Box>

    </React.Fragment>
  )
};

export default About

export const projectQuery = graphql`
  query aboutPageQuery($locale: String!) {
    page: contentfulPages(slug: { eq: "about" }, node_locale : { eq: $locale }) {
      ...PageSingle
    }
  }
`
