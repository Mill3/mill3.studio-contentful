import React, { useEffect, useRef } from 'react'
import Lottie from 'lottie-react'
import { useInView } from 'react-intersection-observer'

const LottieAnimation = ({ animationData, startInView = true, fwRef = null }) => {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: false })
  const animationRef = useRef()

  useEffect(() => {
    const { current } = fwRef || animationRef
    inView && startInView ? current.play() : current.pause()
  })

  return (
    <div ref={ref}>
      <Lottie ref={fwRef || animationRef} autoplay={false} animationData={animationData} />
    </div>
  );
}

export default LottieAnimation;