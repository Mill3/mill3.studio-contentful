import { createClient } from "contentful"
import { last } from "lodash"
// import queryString from 'query-string'

export const ContentfulClient = () =>
  createClient({
    application: `W_K_Content_Platform`,
    host: process.env.CONTENTFUL_HOST,
    space: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  })

export const getContentfulEntryID = () => {
  if (typeof window !== `undefined`) {
    const queryString = require(`query-string`)

    // get id from param URL or ID route
    let id =
      queryString.parse(window.location.search).entry ||
      last(window.location.pathname.split(`/`))
    return id
  } else {
    return null
  }
}
