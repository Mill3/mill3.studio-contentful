import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'

import { LayoutContext } from '@layouts/layoutContext'
import { limit as between } from '@utils/Math'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'

const TRANSFORM_NONE = {}

const ParallaxBox = ({ offset = 0, children, ...props }) => {
    const ref = useRef()
    const scrollbar = useRef()
    const parallax = useRef(0)
    const boundaries = useRef({ top: 0, height: 0, limit: 0 })
    const offsetRef = useRef(offset)
    const layoutContext = useContext(LayoutContext)
    const [ y, setY ] = useState(0)

    const resize = useCallback(() => {
        const { y = 0, height = 0 } = ref.current?.getBoundingClientRect()
        const top = y + (scrollbar.current?.offset.y || 0)

        boundaries.current.top = top
        boundaries.current.height = height
        boundaries.current.limit = Math.max(0, Viewport.height - top)
    })
    const scroll = useCallback(() => {
        // get scroll position
        const scrollY = scrollbar.current?.offset.y || 0

        // get offset value
        const offsetValue = (offsetRef.current instanceof ResponsiveProp ? offsetRef.current.getValue() : offsetRef.current) || 0

        // create temporary new value
        let newValue = 0

        // if offset does not equal zero
        if( offsetValue !== 0 ) {
            const { top, height, limit } = boundaries.current
            const vh = Viewport.height + height - limit
            const y = top + height - scrollY
            const dist = y / vh

            newValue = between(0, 1, 1 - dist)
        }

        // update only if required
        if (newValue !== parallax.current) {
            // save parallax reference
            parallax.current = newValue

            // update state
            setY(newValue * offsetValue)
        }
    })

    // listening to viewport's resize
    useEffect(() => {
        Viewport.on(resize)
        return () => Viewport.off(resize)
    }, [])

    // update offsetRef
    // when need to save offset into a reference because it is used in a useCallback function
    useEffect(() => {
        offsetRef.current = offset
    }, [offset])

    // listening to scrolling
    useEffect(() => {
        // remove listener from old scrollbar reference
        scrollbar.current?.removeListener(scroll)

        // update scrollbar reference
        scrollbar.current = layoutContext?.layoutState?.scrollbar
        
        // update resize calculations & add event listener
        if( scrollbar.current ) {
            resize()
            scrollbar.current.addListener(scroll)
        }

        // remove listener when unmounting component
        return () => scrollbar.current?.removeListener(scroll)
    }, [layoutContext?.layoutState?.scrollbar])



    // only calculate css transform if required
    // if "y" equal zero, we used a saved empty object to avoid recreating empty object during each render
    const transform = y !== 0 ? { transform: `translate3d(0, ${y}px, 0)` } : TRANSFORM_NONE

    // render
    return <Box as="div" ref={ref} style={transform} {...props}>{children}</Box>
}
  
ParallaxBox.propTypes = {
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
}

export default ParallaxBox