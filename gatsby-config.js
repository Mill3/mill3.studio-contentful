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
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mill3 Studio`,
        short_name: `mill3`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#000000`,
        display: `minimal-ui`,
        icon: `src/images/mill3-icon.png`, // This path is relative to the root of the site.
      },
    },
    // {
    //   resolve: 'gatsby-plugin-transition-link',
    //   options: {
    //     layout: require.resolve(`./src/layout`),
    //   },
    // },
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    'gatsby-plugin-offline',
  ],
}
