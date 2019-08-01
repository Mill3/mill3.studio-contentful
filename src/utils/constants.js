import Viewport from '@utils/Viewport'

export const TRANSITION_IN_DELAY = 500
export const TRANSITION_DURATION = 1500
export const TRANSITION_OUT_DURATION = TRANSITION_DURATION / 3.5
export const HAS_HOVER = Viewport.mq('(any-hover: hover)')

export const EASES = {
  default: {
    type: 'spring',
    stiffness: 50,
    mass: 1.125,
  }
}