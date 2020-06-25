import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { injectIntl } from 'gatsby-plugin-intl'

import PageSingle from '@components/pages/PageSingle'

const Formation = ({ data }) => {
  return <PageSingle data={ data } />
}

export default injectIntl(Formation)

export const projectQuery = graphql`
  query formationPageQuery($language: String!) {
    page: contentfulPages(slug: { eq: "formation" }, node_locale : { eq: $language }) {
      ...PageSingle
    }
  }
`
