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

export const calculateDelayFromPosition = (el, index) => {
  console.log('index:', index)
  if (el) {
    // console.log(el.getBoundingClientRect().x, el.getBoundingClientRect().y);
    let positionDelay = (el.getBoundingClientRect().x / 50 * el.getBoundingClientRect().y / 50) * index
    return positionDelay
  }

  // default value
  return TRANSITION_IN_DELAY / 2
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
    this.delay = calculateDelayFromPosition(this.ref.current ? this.ref.current : null, this.props.index)
  }

  render() {
    const { children, index, direction, distance } = this.props
    const { transitionState } = this.context.layoutState
    const { ref } = this

    // determine initial pose, no fade in unless direction is set to both
    const initial = () => direction === `both` ? `hidden` : `visible`

    return (
      <TransitionContainerPoses
        ref={ref}
        // index={index}
        initialPose={initial()}
        distance={distance}
        delay={this.delay}
        pose={transitionState === TRANSITION_PANE_STATES['visible'] ? `out` : `in`}
      >
        {children}
      </TransitionContainerPoses>
    );
  }
}

TransitionContainer.defaultProps = {
  // determines if element should animate in & out, or just on page out
  direction: `both`,
  distance: 80,
  index: 1
}

TransitionContainer.propTypes = {
  children: PropTypes.object.isRequired,
  direction: PropTypes.string,
  distance: PropTypes.number,
  index: PropTypes.number
}


export default TransitionContainer;