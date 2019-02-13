// const ProjectInline = require('./src/components/projects/ProjectInline')
// console.log('ProjectInline:', ProjectInline)
const { BLOCKS, MARKS, INLINES } = require('@contentful/rich-text-types')
// const { richTextToJsx } = require('@madebyconnor/rich-text-to-jsx')

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
      resolve: "gatsby-plugin-transition-link",
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `9bzwr94keh5j`,
        accessToken: `d6cc93293888bce59f3cf5d4f8bac85aff49df2212c3034cd673ef1c5756ef84`,
      },
    },
    {
      resolve: `@contentful/gatsby-transformer-contentful-richtext`,
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locales`,
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
