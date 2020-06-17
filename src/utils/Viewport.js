import { breakpoints } from '@styles/Theme'

const Viewport = (() => {
  const hasWindow = typeof window === 'object'

  const onResize = () => {
    width = window.innerWidth
    height = window.innerHeight
  }
  const on = callback => {
    if (hasWindow) window.addEventListener('resize', callback)
  }
  const off = callback => {
    if (hasWindow) window.removeEventListener('resize', callback)
  }
  const mq = query => {
    return hasWindow ? window.matchMedia(query).matches : false
  }

  const isMobile = () => {
    return hasWindow ? (width <= parseInt(breakpoints[0]) ? true : false) : false
  }

  let width = 0
  let height = 0

  if (hasWindow) {
    on(onResize)
    onResize()
  }

  return {
    on,
    off,
    mq,
    exists: hasWindow,
    get width() { return width },
    get height() { return height },
    get isMobile() { return isMobile },
  }
})()

export default Viewport
