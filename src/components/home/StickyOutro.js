import React from 'react'
import { injectIntl } from 'react-intl'
import { useInView } from 'react-intersection-observer'
import { Box, Text } from 'rebass'
import styled from 'styled-components'

import { ParagraphPoses } from './'
import Container from '@styles/Container'

const TitleStyle = styled.h2`
  margin: 0;
  text-transform: uppercase;
  visibility: hidden;
`

const StickyOutro = ({ intl }) => {
  const [ref, inView] = useInView({ threshold: 1, triggerOnce: true })

  const lets = intl.formatMessage({ id: 'intro.Lets' })
  const work = intl.formatMessage({ id: 'intro.Work' })

  return (
    <Container
      fluid
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className="full-vh"
    >
      <Box
        as={TitleStyle}
        fontFamily={'serif'}
        fontSize={["156px"]}
        fontWeight={"300"}
      >
        {lets} {work}
      </Box>

      <Box
        ref={ref}
        as={ParagraphPoses}
        maxWidth={[467]}
        alignSelf="flex-end"
        initialPose={`init`}
        pose={inView ? `appear` : null}
        delay={0}
      >
        <Text as="p" fontSize={['24px']} lineHeight={["1.333333333"]} m={0} p={0}>
          {intl.formatMessage({ id: 'projects.HomeOutro' })}
        </Text>
      </Box>
    </Container>
  )
}

export default injectIntl(StickyOutro)
