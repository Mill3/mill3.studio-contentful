import React from 'react'
import { injectIntl } from 'react-intl'
import { Box, Text } from 'rebass'

import { ParagraphPoses } from './'
import { ArrowButton } from '@components/buttons'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import Container from '@styles/Container'

const StickyOutro = ({ intl, appear, ...props }) => {
  return (
    <Container
      fluid
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      {...props}
    >
      <Box
        as={ParagraphPoses}
        maxWidth={['100%', null, 340, 467]}
        initialPose={`init`}
        pose={appear ? `appear` : null}
        delay={0}
      >
        <Text as="p" fontSize={[3, null, '24px']} lineHeight={["1.333333333"]} m={0} p={0}>
          {intl.formatMessage({ id: 'projects.HomeOutro' })}
        </Text>

        <Text as="p" m={0} p={0} mt={3}>
          <TransitionLinkComponent to={`/contact/`} color={`#ffffff`}>
            <ArrowButton>{intl.formatMessage({ id: 'projects.HomeOutroButton' })}</ArrowButton>
          </TransitionLinkComponent>
        </Text>
      </Box>
    </Container>
  )
}

export default injectIntl(StickyOutro)
