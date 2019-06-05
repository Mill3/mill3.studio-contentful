let dotenv = require("dotenv")

// import .env const
dotenv.config()

module.exports = {
  siteMetadata: {
    title: `MILL3 Studio`,
    description: `Mill3 is a digital studio established in Montréal and specialized in strategy, design & web development.`,
    author: `MILL3 Studio`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        whitelist: ["CONTENTFUL_HOST", "CONTENTFUL_SPACE_ID", "CONTENTFUL_ACCESS_TOKEN", "CONTENTFUL_ENVIRONMENT", "ZAPIER_HOOK"]
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
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#000000`,
        display: `minimal-ui`,
        icon: `src/images/mill3-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-transition-link",
      options: {
        layout: require.resolve(`./src/layout`),
      }
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
