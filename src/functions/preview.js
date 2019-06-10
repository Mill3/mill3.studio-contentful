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

const toTitleCase = (str) => {
  return str.replace(
      /\w\S*/g,
      function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1);
      }
  );
}

const formContentRow = (row) => {
  // console.warn('row:', row)
  let type = row.sys.contentType.sys.id
  let contentfulTypeName = `Contentful${toTitleCase(type)}`
  let rowFields = row.fields

  // convert Contentful raw type to Gatsby Graphql type
  rowFields['__typename'] = contentfulTypeName

  Object.entries(rowFields).map(row => {
    const [type, value] = row

    // map RichText editor text value matching our GraphQL query
    if (contentfulTypeName === 'ContentfulContentText' && type == 'text') {
      return (rowFields[type] = {"text": value.content})
    }

    if (contentfulTypeName === 'ContentfulContentImages' && type == 'medias') {
      let medias = []
      Object.entries(value).map((media, index) => {
        medias.push(media[1].fields)
      })
      // push new formatted array
      return (rowFields[type] = medias)
    }
  })

  // default return
  return rowFields
}


export async function handler(event, context) {
  const queryParams = event.queryStringParameters
  const entryId = queryParams.entry
  const locale = queryParams.locale || 'en'

  const entries = await client.getEntries({
    include: 10,
    limit: 1000,
    locale: locale
  })

  let entry, model
  let fields = {}

  // find entry
  entry = entries.items.find(item => item.sys.id === entryId)

  // get entry model
  model = entry.sys.contentType.sys.id

  // loop each fields
  Object.entries(entry.fields).map(entryField => {
    const [type, value] = entryField
    const isObject = is(Object, value)
    const isString = is(String, value)

    if (isObject && (type === 'imageMain' || type === 'imageHover')) {
      return (fields[type] = { file: value.fields.file })
    }

    if (isObject && type === 'videoPreview') {
      return (fields[type] = { file: value.fields.file })
    }

    if (isObject && type === 'headerMedia') {
      return (fields[type] = { file: value.fields.file })
    }

    if (isString && type === 'subHeading') {
      return (fields[type] = {'subHeading': value })
    }

    if (isObject && type === 'contentRows') {
      let data = []

      value.forEach((row, index) => {
        try {
          data.push(formContentRow(row))
        } catch (e) {
          console.error(e)
        }
      });

      return (fields[type] = data)
    }

    // return unchanged field by default
    return (fields[type] = value)
  })

  // your server-side functionality
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: fields,
      id: entryId,
      // Fields that are calculated during createPages we have to do manually here
      // postDate: '< Date of post >',
      // pathPrefix: modelToUrl[model],
      // node_locale: 'en',
    }),
  }
};