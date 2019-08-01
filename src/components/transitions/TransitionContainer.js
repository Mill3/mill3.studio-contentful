import React from 'react'
import PropTypes from 'prop-types'
import posed from 'react-pose'

import { TRANSITION_IN_DELAY, EASES } from '@utils/constants'
import { TRANSITION_PANE_STATES } from './index'

const TransitionContainerPoses = posed.div({
  hidden: {
    opacity: 0,
    y: 85,
  },
  in: {
    opacity: 1,
    y: 0,
    delay: ({ index }) => TRANSITION_IN_DELAY * index,
    transition: EASES['default'],
  },
  out: {
    opacity: 0,
    y: -85,
    delay: ({ index }) => 75 * index,
    transition: {
      duration: TRANSITION_IN_DELAY / 2,
      ease: 'easeIn',
    },
  },
})


class TransitionContainer extends React.Component {

  static contextTypes = {
    layoutState: PropTypes.object,
  }

  render() {
    const { children, index } = this.props
    const { transitionState } = this.context.layoutState

    return (
      <TransitionContainerPoses
        index={index}
        initialPose="hidden"
        pose={transitionState === TRANSITION_PANE_STATES['visible'] ? 'out' : 'in'}
      >
        {children}
      </TransitionContainerPoses>
    );
  }
}


export default TransitionContainer;