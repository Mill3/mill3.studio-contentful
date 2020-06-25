import React, { useEffect, useState } from 'react'
import { ContentfulClient } from '@utils/ContentfulClient'
import { Box } from 'rebass'

import { VERTICAL_SPACER } from './index'

const EmbeddedAsset = ({ id }) => {
  const [ url, setUrl ] = useState(null)

  // fetch asset url when mounting component
  useEffect(() => {
    ContentfulClient()
        .getAsset(id)
          .then(asset => { setUrl(asset.fields.file.url) })
          .catch(err => console.error(err))
  }, [])

  return (
    <Box my={VERTICAL_SPACER}>
      {url && <img src={url} className="img-fluid" alt="" />}
    </Box>
  )
}

export default EmbeddedAsset
