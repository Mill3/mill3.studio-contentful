import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import locales from '@locales/locales'

const SEO = props => {
  const siteName = `MILL3 Studio`
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
      return props.translate ? lozalized(props.description) : props.description
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
      htmlAttributes={{
        lang: props.locale || intl.locale
      }}
    >
      {Object.keys(locales).map(locale =>
          <link rel="alternate" href={`https://mill3.studio/${locale}`} hrefLang={locale} key={locale}/>
      )}
      <link rel="alternate" href="https://mill3.studio/fr/" hreflang="x-default" />
      <meta name="description" content={description()} />
      <meta property="og:title" content={title()} />
      <meta property="og:description" content={description()} />
      <meta property="og:image" content={image()} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title()} />
      <meta name="twitter:description" content={description()} />
      <meta name="twitter:image" content={image()} />
    </Helmet>
  )
}

SEO.defaultProps = {
  title: null,
  seoFields: null,
  locale: null
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  translate: PropTypes.bool,
  locale: PropTypes.string,
  seo: PropTypes.shape({
    pageTitle: PropTypes.string,
    pageDescription: PropTypes.string,
    shareImage: PropTypes.object,
  })
}

export default injectIntl(SEO)

export const seoFieldsFragment = graphql`
  fragment seoFragment on ContentfulSeo {
    id
    slug
    pageTitle
    pageDescription
    shareImage {
      fixed(width: 1000, quality: 70) {
        ...GatsbyContentfulFixed_withWebp_noBase64
      }
    }
  }
`
