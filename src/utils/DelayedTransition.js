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

export const DELAYED = 'delayed'

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

  performEnter(node, mounting) {
    const delays = this.getDelays()
    const appearing = this.context ? this.context.isMounting : mounting
    const enterDelay = appearing ? delays.appear : delays.enter

    if( enterDelay === 0 ) {
      super.performEnter(node, mounting)
      return
    }

    this.safeSetState({ status: DELAYED }, () => {
      this.onTransitionEnd(node, enterDelay, () => {
        super.performEnter(node, mounting)
      })
    })
  }

  render() {
    const status = this.state.status
    if (status === DELAYED) {
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

DelayedTransition.DELAYED = DELAYED

export default DelayedTransition
