let dotenv = require('dotenv')
let proxy = require('http-proxy-middleware')

// import .env const
dotenv.config()

module.exports = {
  developMiddleware: app => {
    app.use(
      '/.netlify/functions/',
      proxy({
        target: 'http://localhost:9000',
        pathRewrite: {
          '/.netlify/functions/': '',
        },
      })
    )
  },
  siteMetadata: {
    title: `MILL3 Studio`,
    description: `Mill3 is a digital studio established in Montréal and specialized in strategy, design & web development.`,
    author: `MILL3 Studio`,
    siteUrl: `https://mill3.studio/`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        whitelist: [
          'CONTENTFUL_HOST',
          'CONTENTFUL_SPACE_ID',
          'CONTENTFUL_ACCESS_TOKEN',
          'CONTENTFUL_ENVIRONMENT',
          'ZAPIER_HOOK',
          'PREVIEW_URL_PROJECTS',
        ],
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        host: `${process.env.CONTENTFUL_HOST}`,
        spaceId: `${process.env.CONTENTFUL_SPACE_ID}`,
        accessToken: `${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        environment: `${process.env.CONTENTFUL_ENVIRONMENT}`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locales`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            edges {
              node {
                path
              }
            }
          }
        }`
      }
    },
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/layout.js`),
      },
    },
    {
      resolve: `gatsby-plugin-polyfill-io`,
      options: {
         features: [`IntersectionObserver`]
      },
   },
   {
      resolve: "gatsby-plugin-sentry",
      options: {
        dsn: "https://a084f074750e406c989ccf95fc536b2f@sentry.io/1536062",
        // Optional settings, see https://docs.sentry.io/clients/node/config/#optional-settings
        environment: process.env.NODE_ENV,
        enabled: (() => ["production", "stage"].indexOf(process.env.NODE_ENV) !== -1)()
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mill3 Studio`,
        short_name: `mill3`,
        start_url: `/en/`,
        background_color: `#121212`,
        theme_color: `#121212`,
        display: `minimal-ui`,
        icon: `src/images/mill3-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/fr/`, `/en/`, `/fr/about/`, `/en/about/`, `/fr/projects/*`, `/en/projects/*`],
      },
    },
  ],
}
