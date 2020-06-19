import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { injectIntl } from 'gatsby-plugin-intl'

import PageSingle from '@components/pages/PageSingle'

const Formation = ({ data }) => {
  return (
    <React.Fragment>
      <PageSingle data={ data } />
    </React.Fragment>
  )
}

Formation.contextTypes = {
  layoutState: PropTypes.object,
}

export default injectIntl(Formation)

export const projectQuery = graphql`
  query formationPageQuery($language: String!) {
    page: contentfulPages(slug: { eq: "formation" }, node_locale : { eq: $language }) {
      ...PageSingle
    }
  }
`
