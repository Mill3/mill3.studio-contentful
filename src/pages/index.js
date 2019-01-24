import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { FormattedMessage } from 'react-intl'

import LocalizedLink from '@utils/LocalizedLink'

import Layout from '@components/layout'
import Image from '@components/image'
import SEO from '@components/seo'

const IndexPage = ({ pageContext }) => (
  <Layout locale={pageContext.locale}>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Hi people : { pageContext.locale }</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <LocalizedLink to="/page-2/">Go to page 2</LocalizedLink>
  </Layout>
)

IndexPage.propTypes = {
  pageContext: PropTypes.shape({
    locale: PropTypes.string.isRequired
  }).isRequired
}

export default IndexPage
