import React, { useContext, useEffect, useRef } from 'react'
import { Box, Text } from 'rebass'
import posed from 'react-pose'
import { injectIntl } from 'gatsby-plugin-intl'
import { useInView } from 'react-intersection-observer'

import { ArrowButton } from '@components/buttons'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { LayoutContext } from '@layouts/layoutContext'


const ParagraphPoses = posed.div({
    init: {
      opacity: 0,
      y: 100,
    },
    appear: {
      opacity: 1,
      y: 0,
      delay: ({ delay }) => delay,
      transition: {
        opacity: { duration: 400, easing: 'linear' },
        y: {
          type: 'spring',
          stiffness: 60,
          damping: 8,
        },
      },
    },
    leave: {
      opacity: 0,
      y: 100,
      delay: ({ delay }) => delay,
      transition: {
        opacity: { duration: 400, easing: 'linear' },
        y: {
          type: 'spring',
          stiffness: 60,
          damping: 8,
        },
      },
    },
})  

const HeaderIntroDescription = ({ intl }) => {
    const [ inViewRef, inView ] = useInView({ threshold: 0.5, triggerOnce: true })
    const { layoutState } = useContext(LayoutContext)
    const { demoReel } = layoutState

    const isDemoReel = demoReel?.active === true
    const demoClickedOnceRef = useRef(isDemoReel)

    // when demoReel is active once, never update this variable again
    useEffect(() => {
        if( isDemoReel === true ) demoClickedOnceRef.current = true
    }, [isDemoReel])
    

    return (
        <Box
            ref={inViewRef}
            as={ParagraphPoses}
            width={['100%', null, '55%', '50%']}
            mt={[45, null, 0]}
            pr={[0, null, '6vw', 0]}
            initialPose={`init`}
            pose={isDemoReel ? `leave` : inView ? `appear` : `init`}
            delay={isDemoReel ? 0 : inView && demoClickedOnceRef.current ? 950 : 0}
        >
            <Text
                as="p"
                maxWidth={['100%', null, null, 550]}
                fontSize={[3, null, '24px']}
                lineHeight={['1.333333333']}
                m={0}
                p={0}
            >
                {intl.formatMessage({ id: 'intro.AboutUs' }).toString()}
            </Text>

            <Text as="p" m={0} p={0} mt={[60, null, 3]}>
                <TransitionLinkComponent to={`/about/`} color={'black'}>
                    <ArrowButton color={'white'}>{intl.formatMessage({ id: 'intro.Button' })}</ArrowButton>
                </TransitionLinkComponent>
            </Text>
        </Box>
    )
}

export default React.memo(injectIntl(HeaderIntroDescription))