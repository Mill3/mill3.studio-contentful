import React, { useState } from 'react'
import { graphql } from 'gatsby'
import { Flex, Box } from 'rebass'

import { injectIntl } from 'react-intl'

import ChipButton from '@components/buttons/ChipButton'
import ClientsTicker from '@components/clients/ClientsTicker'
import ClientsList from '@components/clients/ClientsList'
import Container from '@styles/Container'
import PageSingle from '@components/pages/PageSingle'

const About = ({ data, intl }) => {
  const [list, setList] = useState(false);

  return (

    <React.Fragment>

      <PageSingle data={ data } />

      <Flex justifyContent={`flex-end`} px={[2,3,6]} mb={list ? [0] : ['-55px']}>

          <ChipButton onClick={(e) => setList(!list)}>
            {intl.formatMessage({ id: !list ? 'Show list' : 'Ticker please!' }).toString()}
          </ChipButton>

      </Flex>

      <Box pt={list ? [2] : [0]}>
        {/* show client list */}
        {list && <Container><ClientsList /></Container> }
        {/* show ticker */}
        {!list && <ClientsTicker quantity={5} /> }
      </Box>

    </React.Fragment>
  )
};

export default injectIntl(About)

export const projectQuery = graphql`
  query aboutPageQuery($locale: String!) {
    page: contentfulPages(slug: { eq: "about" }, node_locale : { eq: $locale }) {
      ...PageSingle
    }
  }
`
