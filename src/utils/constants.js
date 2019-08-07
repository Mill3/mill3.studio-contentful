import Viewport from '@utils/Viewport'

export const REVEALS_DELAY = 150
export const TRANSITION_INTRO_DELAY = 1250
export const TRANSITION_IN_DELAY = 900
export const TRANSITION_DURATION = 1200
export const TRANSITION_OUT_DURATION = TRANSITION_DURATION / 3.5
export const HAS_HOVER = Viewport.mq('(any-hover: hover)')

export const EASES = {
  default: {
    type: 'spring',
    stiffness: 50,
    mass: 1.125,
  },
}