import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'

const delaysShape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({
    enter: PropTypes.number,
    exit: PropTypes.number,
    appear: PropTypes.number,
  })
])

export const DELAYED_ENTER = 'delayed-enter'
export const DELAYED_EXIT = 'delayed-exit'

class DelayedTransition extends Transition {

  getDelays() {
    const { delay } = this.props
    let exit, enter, appear

    exit = enter = appear = delay

    if (delay != null && typeof delay !== 'number') {
      exit = delay.exit
      enter = delay.enter
      // TODO: remove fallback for next major
      appear = delay.appear !== undefined ? delay.appear : enter
    }
    return { exit, enter, appear }
  }

  updateStatus(mounting = false, nextStatus) {

    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      const { status } = this.state

      // if nextStatus is ENTERING and we are currently in DELAYED_ENTER, do nothing
      if( status === DELAYED_ENTER && nextStatus === 'entering' ) return

      // if nextStatus is EXITING and we are currently in DELAYED_EXIT, do nothing
      if( status === DELAYED_EXIT && nextStatus === 'exiting' ) return

    }

    super.updateStatus(mounting, nextStatus)
  }

  performEnter(node, mounting) {
    const delays = this.getDelays()
    const appearing = this.context ? this.context.isMounting : mounting
    const enterDelay = appearing ? delays.appear : delays.enter

    if( !enterDelay ) {
      super.performEnter(node, mounting)
      return
    }

    if( this.state.status === DELAYED_ENTER ) {
      return
    }

    this.safeSetState({ status: DELAYED_ENTER }, () => {
      this.onTransitionEnd(node, enterDelay, () => {
        super.performEnter(node, mounting)
      })
    })
  }
  performExit(node) {
    const delays = this.getDelays()

    if( !delays.exit ) {
      super.performExit(node)
      return
    }

    if( this.state.status === DELAYED_EXIT ) {
      return
    }

    this.safeSetState({ status: DELAYED_EXIT }, () => {
      this.onTransitionEnd(node, delays.exit, () => {
        super.performExit(node)
      })
    })
  }

  render() {
    const status = this.state.status
    if (status === DELAYED_ENTER) {
      return null
    }

    return super.render()
  }
}

DelayedTransition.propTypes = {
  /**
   * The duration of the delay before running the transition, in milliseconds.
   * Required unless `addEndListener` is provided.
   *
   * You may specify a single delay for all transitions:
   *
   * ```jsx
   * delay={500}
   * ```
   *
   * or individually:
   *
   * ```jsx
   * delay={{
   *  appear: 500,
   *  enter: 300,
   *  exit: 500,
   * }}
   * ```
   *
   * - `appear` defaults to the value of `enter`
   * - `enter` defaults to `0`
   * - `exit` defaults to `0`
   *
   * @type {number | { enter?: number, exit?: number, appear?: number }}
   */
  delay: (props, ...args) => {
    let pt = delaysShape
    return pt(props, ...args)
  },
}

DelayedTransition.DELAYED_ENTER = DELAYED_ENTER
DelayedTransition.DELAYED_EXIT = DELAYED_EXIT

export default DelayedTransition
