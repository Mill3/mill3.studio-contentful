import React, { useContext, useEffect, useRef, useState } from 'react'
import { Box } from 'rebass'

import { LayoutContext } from '@layouts/layoutContext'
import { limit } from '@utils/Math'
import { getTranslate } from '@utils/transform'
import Viewport from '@utils/Viewport'

const StickyElement = ({ children, target, onEnd, ...props }) => {
  const ref = useRef()
  const boundaries = useRef({ top: 0, bottom: 0, scrollY: 0, atEnd: false })

  const [ y, setY ] = useState(0)
  const { layoutState } = useContext(LayoutContext)
  const { scrollbar } = layoutState


  const resize = () => {
    if( !target || !ref.current ) return

    const targetRect = target.getBoundingClientRect()
    const refRect = ref.current.getBoundingClientRect()
    const translate = getTranslate( ref.current )
    const offset = refRect.top - targetRect.top - translate.y

    // update boundaries top & bottom values
    boundaries.current.top = boundaries.current.scrollY + refRect.top - translate.y - offset
    boundaries.current.bottom = targetRect.height - refRect.height - offset
  }
  const scroll = ({ offset }) => {
    // update current scroll position
    boundaries.current.scrollY = offset.y

    const { top, bottom, scrollY, atEnd } = boundaries.current
    const position = limit(0, bottom, (top - scrollY) * -1)

    // if position has changed, update state
    if( position !== y ) setY(position)

    // if position has reached bottom, dispatch callback
    if( position === bottom ) {
      if( !atEnd ) {
        boundaries.current.atEnd = true
        if( onEnd ) onEnd(true)
      }
    } else {
      // if position has reached top, dispatch callback
      if( atEnd ) {
        boundaries.current.atEnd = false
        if( onEnd ) onEnd(false)
      }
    }
  }
  

  // listen to viewport's resize
  useEffect(() => {
    Viewport.on(resize)
    return () => Viewport.off(resize)
  }, [])

  // listen to scrollbar's scroll
  useEffect(() => {
    scrollbar?.addListener(scroll)
    return () => scrollbar?.removeListener(scroll)
  }, [scrollbar])

  // simulate a resize when ref, target or scrollbar changes
  useEffect(resize, [ref, target, scrollbar])


  return (
    <Box ref={ref} {...props} style={{transform: `translate3d(0px, ${y}px, 0)`}}>
      {children}
    </Box>
  )
}

export default StickyElement
