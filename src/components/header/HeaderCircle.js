
import React from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'
import _ from 'lodash'
import { TimelineLite, TweenLite, Power0, Power4 } from 'gsap'

import Circle from '@svg/Circle'

const CircleContainer = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;
  transform: translateY(50%);
  background-blend-mode: lighten;
  svg {
    width: 100%;
    height: auto;
  }
`

class HeaderCircle extends React.Component {

  static mouseWheel
  static timeline
  static rotateTween

  constructor(props) {
    super(props);
    this.state = {
      rotation: 3600
    }
    this.ref = React.createRef()
  }

  componentDidMount() {
    this.rotation()
    this.mouse()
  }

  // componentDidUpdate(prevState, prevProps, state) {
  //   console.log(this.state.rotation);
  // }

  rotation() {
    this.timeline = new TimelineLite({ repeat: true })
    this.timeline.to(this.ref.current, 6000, { rotation: "+=54000", ease: Power4.easeOut })
    // this.timeline.play()
    console.log(this.timeline, this.ref.current);

  }

  mouse() {
    console.log(typeof window);

    if (typeof window == 'object') {
      const Hamster = require('hamsterjs')
      console.log('Hamster:', Hamster)

      this.mouseWheel = Hamster(window);

      this.mouseWheel.wheel((event, delta, deltaX, deltaY) => {
        this.timeline.timeScale(3.25)

        // // reset transformation value after a few seconds
        _.debounce(() => {
          this.timeline.timeScale(1)
        }, 500)();
      });

    }


  }

  render() {
    return (
      <CircleContainer speed={this.state.speed}>
        <Box width={['25vw','15vw','12vw']} pl={['5vw']}>
          <figure ref={this.ref}>
            <Circle />
          </figure>
        </Box>
      </CircleContainer>
    );
  }
}

export default HeaderCircle;