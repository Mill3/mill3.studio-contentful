const Viewport = (() => {
  const onResize = () => {
    width = window.innerWidth
    height = window.innerHeight
  }

  let width = 0
  let height = 0

  if (typeof window === 'object') {
    window.addEventListener('resize', onResize)
    onResize()
  }

  return {
    width,
    height,
  }
})()

export default Viewport
