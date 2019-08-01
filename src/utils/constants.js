import Viewport from '@utils/Viewport'

export const TRANSITION_IN_DELAY = 350
export const TRANSITION_DURATION = 1000
export const TRANSITION_OUT_DURATION = TRANSITION_DURATION / 2
export const HAS_HOVER = Viewport.mq('(any-hover: hover)')

export const EASES = {
  default: {
    type: 'spring',
    stiffness: 50,
    mass: 1.125,
  }
}