import React from 'react'
import { Flex, Box, Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'

import Container from '@styles/Container'
import ContentRow from '@components/content_rows'
import ContentSectionBreak from '@components/content_rows/ContentSectionBreak'
import SEO from '@components/seo'

const PageSingle = ({ intl, data }) => {
  const { page } = data
  // console.log(page)

  return (
    <React.Fragment>

      {page.seo &&
        <SEO seo={page.seo} />
      }

      <ContentSectionBreak data={{ title: page.title, text: { text: page.intro.intro || page.intro.content } }} />
      <ContentRow data={page.contentRows} />

    </React.Fragment>
  )
}

export default injectIntl(PageSingle)
