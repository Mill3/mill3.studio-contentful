import React from 'react'
import PropTypes from 'prop-types'
import posed from 'react-pose'

import { TRANSITION_IN_DELAY, EASES } from '@utils/constants'
import { TRANSITION_PANE_STATES } from './index'

const TransitionContainerPoses = posed.div({
  none: {
    display: `block`
  },
  // when initial needs no animation
  visible: {
    opacity: 1,
    y: 0,
  },
  // default state when animating `both` directions
  hidden: {
    opacity: 0,
    y: ({ distance }) => distance,
  },
  // when transition ends
  in: {
    opacity: 1,
    y: 0,
    delay: ({ delayIn }) => delayIn,
    transition: EASES['default'],
  },
  // when transition starts
  out: {
    opacity: 0,
    y: ({ distance }) => distance * -1,
    delay: ({ delayOut }) => delayOut,
    transition: {
      duration: TRANSITION_IN_DELAY / 2,
      ease: 'easeIn',
    },
  },
})

export const calculateDelayForElement = (el, autoCalculateDelay = true, index = 1) => {
  // calculations if element is mounted and props allows it
  if (el && autoCalculateDelay === true) {
    let positionDelay = (((el.getBoundingClientRect().x / 50) * el.getBoundingClientRect().y) / 50) * index
    return positionDelay
  }

  // default value
  return ((TRANSITION_IN_DELAY / 4) * index)
}

class TransitionContainer extends React.Component {
  static contextTypes = {
    layoutState: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.ref = React.createRef()
    this.calculatedDelay = 0
  }

  componentDidMount() {
    this.calculatedDelay = calculateDelayForElement(
      this.ref.current ? this.ref.current : null,
      this.props.autoCalculateDelay,
      this.props.index
    )
  }

  render() {
    const { children, enabled, disabledPose, direction, distance, delayIn, delayOut } = this.props

    const { transitionState } = this.context.layoutState
    const { ref, calculatedDelay } = this

    // determine initial pose, no fade in unless direction is set to both
    const initial = () => (direction === `both` ? `hidden` : `visible`)

    // pick right pose based on transition status
    const pose = () => (!enabled ? disabledPose : transitionState === TRANSITION_PANE_STATES['visible'] ? `out` : `in`)

    return (
      <TransitionContainerPoses ref={ref} initialPose={initial()} pose={pose()} distance={distance} delayIn={delayIn || calculatedDelay} delayOut={delayOut || calculatedDelay}>
        {children}
      </TransitionContainerPoses>
    )
  }
}

TransitionContainer.defaultProps = {
  enabled: true,
  direction: `both`,
  // disabledPose: `hidden`,
  autoCalculateDelay: true,
  distance: 80,
  delayIn: null,
  delayOut: null,
  index: 1,
}

TransitionContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  enabled: PropTypes.bool,
  disabledPose: PropTypes.string,
  direction: PropTypes.string,
  autoCalculateDelay: PropTypes.bool,
  distance: PropTypes.number,
  delayIn: PropTypes.number,
  delayOut: PropTypes.number,
  index: PropTypes.number,
}

export default TransitionContainer
