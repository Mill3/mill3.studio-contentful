import dotenv from 'dotenv'
import { createClient } from "contentful"
import { is } from 'ramda'

dotenv.config()
// import { last } from "lodash"
// import queryString from 'query-string'

const client = createClient({
  application: `mill3 studio`,
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
      queryString.parse(window.location.search).id ||
      last(window.location.pathname.split(`/`))
    return id
  } else {
    return null
  }
}


export async function handler(event, context) {
  const queryParams = event.queryStringParameters
  // console.log('queryParams:', queryParams)
  const entryId = queryParams.entry
  // console.log('entryId:', entryId)

  const entries = await client.getEntries({
    include: 10,
    limit: 1000,
  })

  let entry, model
  let fields = {}

  entry = entries.items.find(item => item.sys.id === entryId)
  model = entry.sys.contentType.sys.id

  Object.entries(entry.fields).map(entryField => {
    const [type, value] = entryField
    // console.log('type, value:', type)
    const isObject = is(Object, value)
    // console.log('isObject:', isObject)

    if (isObject && (type === 'imageMain' || type === 'imageHover')) {
      return (fields[type] = { file: value.fields.file })
    }

    if (isObject && type === 'videoPreview') {
      return (fields[type] = { file: value.fields.file })
    }

    if (isObject && type === 'headerMedia') {
      return (fields[type] = { file: value.fields.file })
    }

    if (isObject && type === 'contentRows') {
      entryField[1].forEach(row => {
        console.log(`------------------`)
        // console.warn('row:', row)
        console.warn('row:', row.sys.contentType.sys.id)
        console.warn('row:', row.fields)
        console.log(`------------------`)
      });
      // console.log(Object.entries(entryField));
      // console.log(`entry fields :`, entryField)
      // Object.entries(entryField).map(row => {
      //   // console.log(row);
      //   console.log('contentRow:', row)
      // })
      // return (fields[type] = { file: value.fields.file })
    }

    return (fields[type] = value)
  })

  // your server-side functionality
  return {
    statusCode: 200,
    body: JSON.stringify({
      fields
      // Fields that are calculated during createPages we have to do manually here
      // id: entryId,
      // postDate: '< Date of post >',
      // pathPrefix: modelToUrl[model],
      // node_locale: 'en',
    }),
  }
};