import Viewport from '@utils/Viewport'

export const TRANSITION_DURATION = 500
export const HAS_HOVER = Viewport.mq('(any-hover: hover)')

export const EASES = {
  default: {
    type: 'spring',
    stiffness: 50,
    mass: 1.125,
  }
}