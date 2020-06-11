import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { injectIntl } from 'react-intl'

import PageSingle from '@components/pages/PageSingle'

const Formation = ({ data, intl }, { layoutState }) => {
  useEffect(() => {
    if( layoutState.invertedHeader ) layoutState.setHeaderInverted(false) // eslint-disable-next-line react-hooks/exhaustive-deps
    if( layoutState.invertedBody ) layoutState.setBodyInverted(false) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  query formationPageQuery($locale: String!) {
    page: contentfulPages(slug: { eq: "formation" }, node_locale : { eq: $locale }) {
      ...PageSingle
    }
  }
`
