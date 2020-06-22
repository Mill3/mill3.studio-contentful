import React from 'react'
import posed from 'react-pose'
import { Flex } from 'rebass'
import { useInView } from 'react-intersection-observer'

import CodePreview from '@components/codes/CodePreview'
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
})

const InViewCodePreview = ({ children, delay = 0, threshold = 0.25, ...props }) => {
    const [ ref, inView ] = useInView({ threshold, triggerOnce: true })

    return (
        <Flex 
            ref={ref} 
            as={Poses} 
            initialPose="init" 
            pose={inView ? "appear" : "init"} 
            delay={delay instanceof ResponsiveProp ? delay.getValue() : delay}
            withParent={false} 
            {...props}
        >
            {children}
        </Flex>
    )
}

export default InViewCodePreview