import React, { useContext } from 'react'
import posed from 'react-pose'
import { Flex } from 'rebass'
import { useInView } from 'react-intersection-observer'

import CodePreview from '@components/codes/CodePreview'
import { LayoutContext } from '@layouts/layoutContext'
import { TRANSITION_IN_DELAY } from '@utils/constants'
import ResponsiveProp from '@utils/ResponsiveProp'

const Poses = posed.div({
    init: {
        opacity: 0,
        y: 150,
        delay: 0,
    },
    appear: {
        opacity: 1,
        y: 0,
        delay: ({ delay }) => delay,
        transition: {
            type: 'spring',
            stiffness: 30,
            mass: 0.925,
        },
    },
    exit: {
        opacity: 0,
        y: -100,
        delay: ({ delay }) => delay,
        transition: {
            duration: TRANSITION_IN_DELAY / 2,
            ease: 'easeIn',
        },
    }
})

const InViewCodePreview = ({ children, delayIn = 0, delayOut = 0, threshold = 0.25, ...props }) => {
    const [ ref, inView ] = useInView({ threshold, triggerOnce: true })
    const { layoutState } = useContext(LayoutContext)
    const { transition } = layoutState
    const isExiting = transition.state === "started"

    const pose = isExiting ? "exit" : (inView ? "appear" : "init")
    const delay = isExiting ? delayOut : delayIn

    return (
        <Flex
            ref={ref}
            as={Poses}
            initialPose="init"
            pose={pose}
            delay={delay instanceof ResponsiveProp ? delay.getValue() : delay}
            withParent={false}
            {...props}
        >
            {children}
        </Flex>
    )
}

export default InViewCodePreview