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

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@locales': path.resolve(__dirname, 'locales/'),
        '@components': path.resolve(__dirname, 'src/components/'),
        '@pages': path.resolve(__dirname, 'src/pages/'),
        '@utils': path.resolve(__dirname, 'src/utils/'),
        // '@reducers': path.resolve(__dirname, 'src/reducers/'),
      },
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  })
}


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

      const ProjectSingleTemplate = path.resolve(`./src/components/projects/ProjectSingle.js`)

      _.each(result.data.allContentfulProjects.edges, edge => {
        createPage({
          path: `/${edge.node.node_locale}/projects/${edge.node.slug}/`,
          component: slash(ProjectSingleTemplate),
          context: {
            id: edge.node.id,
            contentful_id:  edge.node.contentful_id,
            slug:  edge.node.slug,
            locale: edge.node.node_locale
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

