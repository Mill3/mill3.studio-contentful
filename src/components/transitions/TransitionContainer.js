import React, { useRef, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import posed from 'react-pose'

import { TRANSITION_IN_DURATION, TRANSITION_IN_DELAY, EASES } from '@utils/constants'

import { LayoutContext } from '@layouts/layoutContext'

const TransitionContainerPoses = posed.div({
  none: {
    display: `block`,
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
      duration: TRANSITION_IN_DURATION,
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
  return (TRANSITION_IN_DELAY / 4) * index
}

const TransitionContainer = props => {
  const { children, enabled, disabledPose, direction, distance, delayIn, delayOut, autoCalculateDelay, index, ...rest } = props
  const { layoutState } = useContext(LayoutContext)
  const { transition } = layoutState
  const [ pose, setPose ] = useState('in')
  const [calculatedDelay, setCalculatedDelay] = useState(0)
  const ref = useRef()
  const initial = `hidden`

  useEffect(() => {
    // calculate delay
    setCalculatedDelay(
      calculateDelayForElement(ref.current ? ref.current : null, autoCalculateDelay, index)
    )

    // set pose
    if(!enabled ) {
      setPose(disabledPose)
    } else if(enabled && transition.inTransition) {
      setPose('out')
    } else {
      setPose('in')
    }
  }, [ref, layoutState, autoCalculateDelay, index, enabled, disabledPose, transition]);

  return (
    <Box
      as={TransitionContainerPoses}
      ref={ref}
      initialPose={initial}
      pose={pose}
      distance={distance}
      delayIn={delayIn || calculatedDelay}
      delayOut={delayOut || calculatedDelay}
      {...rest}
    >
      {children}
    </Box>
  )
}

TransitionContainer.defaultProps = {
  enabled: true,
  disabledPose: `none`,
  direction: `both`,
  autoCalculateDelay: true,
  distance: 80,
  delayIn: null,
  delayOut: null,
  index: 1,
}

TransitionContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  enabled: PropTypes.bool,
  disabledPose: PropTypes.string,
  direction: PropTypes.string,
  autoCalculateDelay: PropTypes.bool,
  distance: PropTypes.number,
  delayIn: PropTypes.number,
  delayOut: PropTypes.number,
  index: PropTypes.number,
}

export default React.memo(TransitionContainer)
