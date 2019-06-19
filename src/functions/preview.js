import dotenv from 'dotenv'
import { createClient } from "contentful"
import { is, mergeDeepRight, mergeAll } from 'ramda'

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

const contentRowFormatter = (row) => {
  let type = row.sys.contentType.sys.id

    // get all fields
  let { fields } = row

   // Match internal Gatsby's name
  // convert Contentful raw type to Gatsby Graphql type
  let contentfulTypeName = `Contentful${toTitleCase(type)}`
  fields['__typename'] = contentfulTypeName

  // loop each field
  Object.entries(fields).map(row => {
    const [type, value] = row

    // map RichText editor text value matching our GraphQL query
    if (contentfulTypeName === 'ContentfulContentText' && type == 'text') {
      return (fields[type] = {"text": value.content})
    }

    if (contentfulTypeName === 'ContentfulContentText' && type == 'textColumns') {
      let items = []
      Object.entries(value).map((imageItem) => {
        let fields = imageItem[1].fields
        items.push(fields)
      })

      // push new reformatted entry
      return (fields[type] = items)
    }

    if (contentfulTypeName === 'ContentfulContentImages' && type == 'overlayImage') {
      return (fields[type] = { file: value.fields.file })
    }

    if (contentfulTypeName === 'ContentfulContentImages' && type == 'medias') {
      let medias = []
      Object.entries(value).map((media, index) => {
        medias.push(media[1].fields)
      })
      // push new formatted array
      return (fields[type] = medias)
    }

    if (contentfulTypeName === 'ContentfulContentSlides' && type == 'medias') {
      let medias = []
      Object.entries(value).map((media, index) => {
        medias.push(media[1].fields)
      })
      // push new formatted array
      return (fields[type] = medias)
    }

    //
    // TODO: refactor me in a method
    //
    if (contentfulTypeName === 'ContentfulContentImages' && type == 'imageItems') {
      let items = []
      Object.entries(value).map((imageItem) => {
        let fields = imageItem[1].fields
        Object.entries(fields).map((imageItemField) => {
          let [imageItemFieldType, imageItemFieldValue] = imageItemField
          if (imageItemFieldType === 'media') {
            fields[imageItemFieldType] = imageItemFieldValue.fields
          }
        })
        items.push(fields)
      })

      // push new reformatted entry
      return (fields[type] = items)
    }

    //
    // TODO: refactor me in a method
    //
    if (contentfulTypeName === 'ContentfulContentVideos' && type == 'videos') {
      let videos = []
      Object.entries(value).map((video, index) => {
        let fields = video[1].fields
        Object.entries(fields).map((videoField, index) => {
          let [videoFieldType, videoFieldValue] = videoField
          if (videoFieldType === 'videoPoster') {
            fields[videoFieldType] = videoFieldValue.fields
          }
        })
        videos.push(fields)
      })

      // push new reformatted entry
      return (fields[type] = videos)
    }

  })

  // return fields back
  return fields
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

  // set model type to fields
  fields['model'] = model

  // loop each first level fields
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
      // start fresh for contentRows
      let data = []

      value.forEach((row, index) => {
        try {
          // reformat data using our
          data.push(contentRowFormatter(row))
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
    }),
  }
};