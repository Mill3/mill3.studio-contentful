/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const _ = require(`lodash`)
const path = require(`path`)
const slash = require(`slash`)
const locales = require('./locales/locales')

exports.onCreateWebpackConfig = ({ stage, getConfig, rules, loaders, plugins, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@locales': path.resolve(__dirname, 'locales/'),
        '@components': path.resolve(__dirname, 'src/components/'),
        '@pages': path.resolve(__dirname, 'src/pages/'),
        '@utils': path.resolve(__dirname, 'src/utils/'),
        '@styles': path.resolve(__dirname, 'src/styles/'),
        '@svg': path.resolve(__dirname, 'src/svg/'),
        '@images': path.resolve(__dirname, 'src/images/'),
      },
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    // Project index page

    graphql(
      `
        {
          allContentfulProjects(sort: { fields: [createdAt], order: DESC }) {
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

      // get templates
      const ProjectIndexTemplate = path.resolve(`./src/components/projects/ProjectsIndex.js`)
      const ProjectSingleTemplate = path.resolve(`./src/components/projects/ProjectSingle.js`)
      const projects = result.data.allContentfulProjects.edges

      // Loop each locales Index page
      _.each(locales, locale => {
        createPage({
          path: `/${locale.path}/projects/`,
          component: slash(ProjectIndexTemplate),
          context: {
            locale: locale.path,
          },
        })

        // get all project for current locale
        const localizedProjects = projects.filter(project => project.node.node_locale === locale.path)

        _.each(localizedProjects, (edge, index) => {
          // pick next node
          const next =
            index === localizedProjects.length - 1 ? localizedProjects[0].node : localizedProjects[index + 1].node

          createPage({
            path: `/${edge.node.node_locale}/projects/${edge.node.slug}/`,
            component: slash(ProjectSingleTemplate),
            context: {
              id: edge.node.id,
              contentful_id: edge.node.contentful_id,
              slug: edge.node.slug,
              locale: edge.node.node_locale,
              colorMain: edge.node.colorMain | `#000`,
              nextId: next ? next.id : null,
            },
          })
        })
      })
    })

    // News index page
    graphql(
      `
        {
          allContentfulNews {
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

      // get templates
      const NewsIndexTemplate = path.resolve(`./src/components/news/NewsIndex.js`)
      const NewsSingleTemplate = path.resolve(`./src/components/news/NewsSingle.js`)

      // News Index page
      _.each(locales, locale => {
        createPage({
          path: `/${locale.path}/journal/`,
          component: slash(NewsIndexTemplate),
          context: {
            locale: locale.path,
          },
        })
      })

      _.each(result.data.allContentfulNews.edges, edge => {
        createPage({
          path: `/${edge.node.node_locale}/journal/${edge.node.slug}/`,
          component: slash(NewsSingleTemplate),
          context: {
            id: edge.node.id,
            contentful_id: edge.node.contentful_id,
            slug: edge.node.slug,
            locale: edge.node.node_locale,
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
    // delete all pages, except the 404 pages and Root page, SW Offline support
    if (
      page.internalComponentName.search(`Offline`) < 0 &&
      page.internalComponentName.search(`404`) < 0 &&
      page.internalComponentName.search(`Root`) < 0
    ) {
      console.log(`.....`)
      console.log(`deleting page ${page.internalComponentName}`)
      console.log(`.....`)
      deletePage(page)
    } else {
      // push basic layout to 404 or root page
      page.context.layout = 'basic'
      createPage(page)
    }

    Object.keys(locales).map(lang => {
      const localizedPath = page.internalComponentName === 'ComponentRoot' ? `/` : locales[lang].path + page.path

      createPage({
        ...page,
        path: localizedPath,
        context: {
          locale: lang,
          layout: page.context.layout,
        },
      })
    })

    resolve()
  })
}
