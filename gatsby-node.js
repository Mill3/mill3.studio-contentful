/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const _ = require(`lodash`)
const path = require(`path`)
const slash = require(`slash`)
const locales = require('./locales')

console.log(locales);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {

    graphql(
      `
      {
        allContentfulProjects {
          edges {
            node {
              id
              contentful_id
              slug
              node_locale
            }
          }
        }
      }
      `
    ).then(result => {
      if (result.errors) {
        reject(result.errors)
      }

      const projectTemplate = path.resolve(`./src/projects/project-single.js`)

      _.each(result.data.allContentfulProjects.edges, edge => {
        createPage({
          path: `/${edge.node.node_locale}/projects/${edge.node.slug}/`,
          component: slash(projectTemplate),
          context: {
            id: edge.node.id,
            contentful_id:  edge.node.contentful_id,
            slug:  edge.node.slug,
          },
        })
      })
    })

    resolve()
  })
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  return new Promise((resolve, reject) => {

    // delete page, except the Dev 404 page
    if (page.internalComponentName !== 'ComponentDev404Page') {
      console.log(`.....`);
      console.log(`deleting page ${page.internalComponentName}`);
      console.log(`.....`);
      deletePage(page)
    }

    Object.keys(locales).map(lang => {

      const localizedPath = page.internalComponentName === 'ComponentRoot' ? `/` : locales[lang].path + page.path

      createPage({
        ...page,
        path: localizedPath,
        context: {
          locale: lang
        }
      })
    })

    resolve()

  })
}

