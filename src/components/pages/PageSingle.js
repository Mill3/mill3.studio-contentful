import React from 'react'
import { Flex, Box, Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'

import ContentRow from '@components/content_rows'
import SEO from '@components/seo'

const PageSingle = ({ intl, data }) => {
  const { page } = data

  return (
    <Box as="section" mb={['30px', null, 4]} mt={['30px', null, 6]}>

      {page.seo &&
        <SEO seo={page.seo} url={`${page.slug}/`} />
      }

      <ContentRow data={page.contentRows} />

    </Box>
  )
}

export default injectIntl(PageSingle)
