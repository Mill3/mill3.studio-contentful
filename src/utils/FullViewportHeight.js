import React, { useEffect } from 'react'

import Viewport from '@utils/Viewport'

const FullViewportHeight = ({ children }) => {
  const resize = () => document.documentElement.style.setProperty('--vh', `${Viewport.height * 0.01}px`)

  useEffect(() => {
    Viewport.on(resize)
    resize()

    return () => Viewport.off(resize)
  }, [])

  return (
    <>{children}</>
  )
}

export default FullViewportHeight
