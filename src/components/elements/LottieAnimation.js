import React, { useEffect, useRef } from 'react'
import Lottie from 'lottie-react'
import { useInView } from 'react-intersection-observer'

const LottieAnimation = React.forwardRef((props, ref) => {
  const { animationData, startInView = true } = props
  const [refWrapper, inView] = useInView({ threshold: 0.1 })
  const animationRef = useRef()

  useEffect(() => {
    const { current } = ref || animationRef
    inView && startInView ? current.play() : current.pause()
  })

  return (
    <div ref={refWrapper}>
      <Lottie ref={ref || animationRef} autoplay={false} animationData={animationData} />
    </div>
  );
})

export default LottieAnimation;