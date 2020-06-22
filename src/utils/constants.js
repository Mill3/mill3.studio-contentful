import Viewport from '@utils/Viewport'

// eases

export const EASES = {
  default: {
    type: 'spring',
    stiffness: 50,
    mass: 1.125,
  },
}

// base value for all transition durations or delays

export const TRANSITION_BASE = 600

// duration base

export const TRANSITION_DURATION = TRANSITION_BASE

// on exit

export const TRANSITION_OUT_DURATION = TRANSITION_DURATION

export const TRANSITION_OUT_DELAY = 0

// on entering

export const TRANSITION_IN_DELAY = TRANSITION_BASE

export const TRANSITION_IN_DURATION = TRANSITION_BASE / 2

// delay for intro

export const TRANSITION_INTRO_DURATION = TRANSITION_DURATION * 1.5

export const TRANSITION_INTRO_DELAY = TRANSITION_DURATION * 3

// delay for reveals

export const REVEALS_DELAY = 150

// various selectors

export const HAS_HOVER = Viewport.mq('(any-hover: hover)')

export const IS_TOUCH_DEVICE = Viewport.mq('(pointer: coarse)')

