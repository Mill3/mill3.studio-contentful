import { findLastIndex } from 'lodash'

import { breakpoints } from '@styles/Theme'
import Viewport from '@utils/Viewport'

let INITIALIZED = false
let BREAKPOINT = 0

const updateBreakpoint = () => {
  BREAKPOINT = findLastIndex(breakpoints, (breakpoint) => Viewport.mq(`(min-width: ${breakpoint})`))
  BREAKPOINT = Math.min(breakpoints.length - 1, BREAKPOINT + 1)
}

class ResponsiveProp {
  constructor(values) {
    const length = values.length
    let previousValue = 0

    // normalize values for each breakpoints
    this.values = breakpoints.map((breakpoint, index) => {
      const value = index < length ? values[index] : null
      if( value === null ) return previousValue

      previousValue = value
      return value
    })

    if( !INITIALIZED ) {
      INITIALIZED = true;

      Viewport.on(updateBreakpoint)
      updateBreakpoint()
    }
  }

  getValue() {
    return this.values[ BREAKPOINT ]
  }
}

export default ResponsiveProp
