import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

const SEO = props => {
  const siteName = `Mill3 Studio`
  const siteDescription = `click, code & craft.`
  const sep = `|`
  const { intl } = props

  const defaultTitle = () => `${siteName} ${sep} ${siteDescription}`

  const lozalized = (id) => {
    return intl.formatMessage({ 'id': id }).toString()
  }

  const title = () => {
    if (props.seo) {
      if (props.seo.pageTitle) {
        return `${props.seo.pageTitle} ${sep} ${siteName}`
      } else if (props.title) {
        return `${props.translate ? lozalized(props.title) : props.title} ${sep} ${siteName}`
      } else {
        return defaultTitle()
      }
    } else {
      return props.title ? `${props.translate ? lozalized(props.title) : props.title} ${sep} ${siteName}` : defaultTitle()
    }
  }

  const description = () => {
    if (props.seo) {
      if (props.seo.pageDescription) {
        return props.seo.pageDescription
      } else if (props.description) {
        return props.description
      }
    } else if (props.description) {
      return props.description
    }
  }

  const image = () => {
    if (props.seo && props.seo.shareImage) {
      return props.seo.shareImage.fixed.src
    } else if (props.image) {
      return props.image
    }
  }

  return (
    <Helmet
      defaultTitle={`${siteName}`}
      title={title()}
      mateDescription={description()}
    >
      <meta name="description" content={description()} />
      <meta property="og:title" content={title()} />
      <meta property="og:description" content={description()} />
      <meta property="og:image" content={image()} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title()} />
      <meta name="twitter:description" content={description()} />
      <meta name="twitter:image" content={image()} />
      <meta
        name="ahrefs-site-verification"
        content="60731af8a710220fa57373aeca408f14e0fb65e8dc1322d66fb4e2c5621f9da1"
      />
    </Helmet>
  )
}

SEO.defaultProps = {
  title: null,
  seoFields: null,
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  translate: PropTypes.bool,
  seo: PropTypes.shape({
    pageTitle: PropTypes.string,
    pageDescription: PropTypes.object,
    shareImage: PropTypes.object,
  })
}

export default injectIntl(SEO)

export const seoFieldsFragment = graphql`
  fragment seoFragment on ContentfulSeo {
    id
    pageTitle
    pageDescription
    shareImage {
      fixed(width: 1000, quality: 70) {
        ...GatsbyContentfulFixed_withWebp_noBase64
      }
    }
  }
`
