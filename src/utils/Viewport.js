const Viewport = (() => {
  const hasWindow = typeof window === 'object'

  const onResize = () => {
    width = window.innerWidth
    height = window.innerHeight
  }
  const on = (callback) => {
    if( hasWindow ) window.addEventListener('resize', callback)
  }
  const off = (callback) => {
    if( hasWindow ) window.removeEventListener('resize', callback)
  }

  let width = 0
  let height = 0

  if( hasWindow ) {
    on(onResize)
    onResize()
  }

  return {
    width,
    height,
    on,
    off,
  }
})()

export default Viewport
