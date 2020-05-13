import React from 'react'
import { graphql } from 'gatsby'
import { injectIntl } from 'react-intl'

import ClientsFooter from '@components/clients/ClientsFooter'
import PageSingle from '@components/pages/PageSingle'

const About = ({ data, intl }) => {
  return (

    <React.Fragment>

      <PageSingle data={ data } />

      <ClientsFooter/>

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
