import React from 'react'
import { graphql } from 'gatsby'

import { injectIntl } from 'react-intl'

import PageSingle from '@components/pages/PageSingle'

const About = ({ data, intl }) => {
  return (
    <React.Fragment>
      <PageSingle data={ data } />
    </React.Fragment>
  )
}

export default injectIntl(About)

export const projectQuery = graphql`
  query formationPageQuery($locale: String!) {
    page: contentfulPages(slug: { eq: "formation" }, node_locale : { eq: $locale }) {
      ...PageSingle
    }
  }
`
