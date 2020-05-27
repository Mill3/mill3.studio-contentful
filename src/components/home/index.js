import posed from 'react-pose'

export const ParagraphPoses = posed.div({
  init: {
    opacity: 0,
    y: 100,
  },
  appear: {
    opacity: 1,
    y: 0,
    delay: ({delay}) => delay,
    transition: {
      opacity: { duration: 400, easing: 'linear' },
      y: {
        type: 'spring',
        stiffness: 60,
        damping: 8,
      },
    },
  }
})

export default {
  ParagraphPoses,
}
