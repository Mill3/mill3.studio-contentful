import React from 'react'
import PropTypes from 'prop-types'
import posed from 'react-pose'

import { TRANSITION_IN_DELAY, EASES } from '@utils/constants'
import { TRANSITION_PANE_STATES } from './index'

const TransitionContainerPoses = posed.div({
  // default state, hidden with y offset
  hidden: {
    opacity: 0,
    y: ({ distance }) => distance,
  },
  // when initial needs no animation
  visible: {
    opacity: 1,
    y: 0,
  },
  // when transition ends
  in: {
    opacity: 1,
    y: 0,
    delay: ({ delay }) => delay,
    // delay: ({ index }) => TRANSITION_IN_DELAY * index,
    transition: EASES['default'],
  },
  // when transition starts
  out: {
    opacity: 0,
    y: ({ distance }) => distance * -1,
    delay: ({ delay }) => delay,
    transition: {
      duration: TRANSITION_IN_DELAY / 2,
      ease: 'easeIn',
    },
  },
})

export const calculateDelayForElement = (el, autoCalculateDelay, index) => {
  // calculations if element is mounted and props allows it
  if (el && autoCalculateDelay === true) {
    let positionDelay = (((el.getBoundingClientRect().x / 50) * el.getBoundingClientRect().y) / 50) * index
    return positionDelay
  }

  // default value
  return (TRANSITION_IN_DELAY / 4) * index
}

class TransitionContainer extends React.Component {
  static contextTypes = {
    layoutState: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.ref = React.createRef()
    this.delay = 0
  }

  componentDidMount() {
    this.delay = calculateDelayForElement(
      this.ref.current ? this.ref.current : null,
      this.props.autoCalculateDelay,
      this.props.index
    )
  }

  render() {
    const { children, direction, distance } = this.props
    const { transitionState } = this.context.layoutState
    const { ref } = this

    // determine initial pose, no fade in unless direction is set to both
    const initial = () => (direction === `both` ? `hidden` : `visible`)

    // pick right pose based on transition status
    const pose = () => (transitionState === TRANSITION_PANE_STATES['visible'] ? `out` : `in`)

    return (
      <TransitionContainerPoses ref={ref} initialPose={initial()} pose={pose()} distance={distance} delay={this.delay}>
        {children}
      </TransitionContainerPoses>
    )
  }
}

TransitionContainer.defaultProps = {
  direction: `both`,
  autoCalculateDelay: true,
  distance: 80,
  index: 1,
}

TransitionContainer.propTypes = {
  children: PropTypes.object.isRequired,
  autoCalculateDelay: PropTypes.bool,
  direction: PropTypes.string,
  distance: PropTypes.number,
  index: PropTypes.number,
}

export default TransitionContainer
