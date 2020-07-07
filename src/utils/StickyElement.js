import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Box } from 'rebass'

import { LayoutContext } from '@layouts/layoutContext'
import { limit } from '@utils/Math'
import { getTranslate } from '@utils/transform'
import Viewport from '@utils/Viewport'

const StickyElement = ({ children, target, onEnd, ...props }) => {
  const ref = useRef()
  const targetRef = useRef()
  const scrollRef = useRef()
  const onEndRef = useRef()
  const boundaries = useRef({ top: 0, bottom: 0, scrollY: 0, atEnd: false })

  const [ y, setY ] = useState(0)
  const { layoutState } = useContext(LayoutContext)
  const { scrollbar } = layoutState


  const resize = useCallback(() => {
    if( !targetRef.current || !ref.current ) return

    const targetRect = targetRef.current.getBoundingClientRect()
    const refRect = ref.current.getBoundingClientRect()
    const translate = getTranslate( ref.current )
    const offset = refRect.top - targetRect.top - translate.y

    // update boundaries top & bottom values
    boundaries.current.top = boundaries.current.scrollY + refRect.top - translate.y - offset
    boundaries.current.bottom = targetRect.height - refRect.height - offset
  })
  const scroll = useCallback(({ offset }) => {
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
        if( onEndRef.current ) onEndRef.current(true)
      }
    } else {
      // if position has reached top, dispatch callback
      if( atEnd ) {
        boundaries.current.atEnd = false
        if( onEndRef.current ) onEndRef.current(false)
      }
    }
  })
  

  // listen to viewport's resize
  useEffect(() => {
    Viewport.on(resize)
    return () => Viewport.off(resize)
  }, [])

  // update targetRef
  useEffect(() => {
    targetRef.current = target
  }, [target])

  // update onEndRef
  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  // listen to scrollbar's scroll
  useEffect(() => {
    scrollRef.current = scrollbar
    scrollRef.current?.addListener(scroll)

    return () => scrollRef.current?.removeListener(scroll)
  }, [scrollbar])

  // simulate a resize when ref, targetRef or scrollRef changes
  useEffect(resize, [ref.current, targetRef.current, scrollRef.current])


  return (
    <Box ref={ref} {...props} style={{transform: `translate3d(0px, ${y}px, 0)`}}>
      {children}
    </Box>
  )
}

export default StickyElement
