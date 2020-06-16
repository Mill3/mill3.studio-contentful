import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'gatsby-plugin-intl'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import locales from '@locales/locales'

const DEFAULT_SITENAME = `meta.title`
const DEFAULT_DESCRIPTION = `click, code & craft.`
const SEP_CHAR = `—`

const SEO = props => {

  const { intl } = props

  const siteName = () => (props.seo && !props.seo.removeDefaultTitle) ? lozalized(DEFAULT_SITENAME) : ``

  const sepLine = () => (props.seo && !props.seo.removeDefaultTitle) ? SEP_CHAR : ``

  const defaultTitle = () => `${siteName()} ${sepLine()} ${DEFAULT_DESCRIPTION}`

  const lozalized = (id) =>  intl.formatMessage({ 'id': id }).toString()

  const title = () => {
    if (props.seo) {
      if (props.seo.pageTitle) {
        return `${props.seo.pageTitle} ${sepLine()} ${siteName()}`
      }
      return defaultTitle()
    } else {
      return props.title ? `${props.translate ? lozalized(props.title) : props.title} ${sepLine()} ${siteName()}` : defaultTitle()
    }
  }

  const description = () => {
    if (props.seo) {
      if (props.seo.pageDescription) {
        return props.seo.pageDescription
      }
      return props.description
    } else if (props.description) {
      return props.translate ? lozalized(props.description) : props.description
    }
  }

  const image = () => {
    if (props.seo && props.seo.shareImage) {
      return props.seo.shareImage.fixed.src
    }
    return props.image
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
      {props.url &&
        <link rel="canonical" href={`https://mill3.studio/${props.locale || intl.locale}/${props.url || ''}`} />
      }
      {Object.keys(locales).map(locale =>
        <link rel="alternate" href={`https://mill3.studio/${locale}/${props.url || ''}`} hrefLang={locale} key={locale} />
      )}
      <link rel="alternate" href={`https://mill3.studio/en/${props.url || ''}`} hreflang="x-default" />
      <meta name="description" content={description()} />
      <meta property="og:type" content={`website`} />
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
  locale: null,
  url: false
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  translate: PropTypes.bool,
  locale: PropTypes.string,
  url: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  seo: PropTypes.shape({
    pageTitle: PropTypes.string,
    pageDescription: PropTypes.string,
    shareImage: PropTypes.object,
    removeDefaultTitle: PropTypes.bool,
  })
}

export default injectIntl(SEO)

export const seoFieldsFragment = graphql`
  fragment seoFragment on ContentfulSeo {
    id
    slug
    pageTitle
    pageDescription
    removeDefaultTitle
    shareImage {
      fixed(width: 1000, quality: 70) {
        ...GatsbyContentfulFixed_withWebp_noBase64
      }
    }
  }
`
