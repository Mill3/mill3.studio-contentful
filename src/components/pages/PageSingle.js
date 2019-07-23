import React from 'react'
import { Flex, Box, Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'

import Container from '@styles/Container'
import ContentRow from '@components/content_rows'
import ContentSectionBreak from '@components/content_rows/ContentSectionBreak'
import SEO from '@components/seo'

const PageSingle = ({ intl, data }) => {
  const { page } = data

  return (
    <Box as="section" mb={['30px', null, 4]} mt={['30px', null, 6]}>

      {page.seo &&
        <SEO seo={page.seo} />
      }

      <ContentSectionBreak data={{ title: page.title, text: { text: page.intro.intro || page.intro.content } }} />
      <ContentRow data={page.contentRows} />

    </Box>
  )
}

export default injectIntl(PageSingle)
