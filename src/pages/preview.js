import React, { useState, useEffect, useRef } from 'react'
import { injectIntl } from 'gatsby-plugin-intl'

import ProjectSingle from '@components/projects/ProjectSingle'
import NewsSingle from '@components/news/NewsSingle'
import PageSingle from '@components/pages/PageSingle'
import { getContentfulEntryID } from '@utils/ContentfulClient'

const Preview = ({ intl, pageContext }) => {
  const entryID = useRef()
  const [ data, setData ] = useState(null)
  const { locale } = intl

  const update = () => {
    console.time(`fetchNewData`)

    fetch(`${process.env.PREVIEW_URL_PROJECTS}?entry=${entryID.current}&locale=${locale}`)
      .then(response => response.json())
      .then(node => {
        console.log('node:', node)
        console.warn('Fetched new data')
        console.timeEnd(`fetchNewData`)

        setData(node.data)
      })
  }

  // save Contentful entry ID
  useEffect(() => entryID.current = getContentfulEntryID(), [])

  // run update method during component mount
  useEffect(update, [])

  // only when we are rendering our app client side
  if (typeof window === `object`) {
    const Visibility = require('visibilityjs')

    useEffect(() => {
      // start an interval refreshing data every 2 sec
      const id = Visibility.every(2000, update)

      // stop interval when unmounted
      return () => Visibility.stop(id)
    }, [])
  }


  // pick content component
  switch ( data?.model ) {
    case 'projects':
      return <ProjectSingle pageContext={pageContext} data={{ project: data }} />
    case 'news':
      return <NewsSingle pageContext={pageContext} data={{ news: data }} />
    case 'pages':
      return <PageSingle pageContext={pageContext} data={{ page: data }} />
    default:
      return null
  }
}

export default  injectIntl(Preview)
