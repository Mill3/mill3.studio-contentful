import React from 'react'
import posed from 'react-pose'
import { Box, Text } from 'rebass'
import { injectIntl } from 'gatsby-plugin-intl'

import { ParagraphPoses } from './'
import { ArrowButton } from '@components/buttons'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import Container from '@styles/Container'

const ParagraphHidePoses = posed.p({
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
  }
})


const StickyIntro = ({ intl, appear, inverted, hidden, ...props }) => {
  const latest = intl.formatMessage({ id: 'intro.Latest' })
  const work = intl.formatMessage({ id: 'intro.Work' })
  const delay = (latest + work).length * 30 + 550

  return (
    <Container
      fluid
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      color={inverted ? "white" : "black"}
      {...props}
    >
      <Box
        fontSize={[3, null, '24px']}
        lineHeight={"1.333333333"}
        maxWidth={['100%', null, 375, 467]}
        alignSelf="flex-end"
        style={{position: 'relative', pointerEvents: hidden ? 'none' : 'auto'}}
      >
        <Text as="p" fontSize={'inherit'} lineHeight={'inherit'} m={0} p={0} style={{visibility: 'hidden', pointerEvents: 'none'}}>
          {intl.formatMessage({ id: 'intro.LatestWorkIntro' }).toString()}
        </Text>

        <Box
          as={ParagraphPoses}
          initialPose="init"
          pose={appear ? "appear" : null}
          delay={delay}
          style={{position: 'absolute', top: 0, left: 0}}
          aria-hidden={true}
        >
          <Text
            as={ParagraphHidePoses}
            fontSize={'inherit'}
            lineHeight={'inherit'}
            m={0}
            p={0}
            initialPose={`visible`}
            pose={hidden ? `hidden` : `visible`}
          >
            {intl.formatMessage({ id: 'intro.LatestWorkIntro' }).toString()}
          </Text>

          <Text
            as={ParagraphHidePoses}
            m={0}
            p={0}
            mt={[60, null, 3]}
            initialPose={`visible`}
            pose={hidden ? `hidden` : `visible`}
          >
            <TransitionLinkComponent to={`/projects/`}>
              <ArrowButton color={inverted ? "white" : "black"}>{intl.formatMessage({ id: 'projects.Button' })}</ArrowButton>
            </TransitionLinkComponent>
          </Text>
        </Box>
      </Box>
    </Container>
  )
}

export default injectIntl(StickyIntro)
