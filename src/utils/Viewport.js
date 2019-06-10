const Viewport = (() => {
  const onResize = () => {
    width = window.innerWidth
    height = window.innerHeight
  }

  let width, height;
  window.addEventListener('resize', onResize);
  onResize();

  return {
    width,
    height,
  }
})();

export default Viewport
