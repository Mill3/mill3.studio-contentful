import React from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'
import { debounce } from 'lodash'
import { TweenLite, TimelineLite, Power4 } from 'gsap'

import Form from '@svg/Form'

const Container = styled.div`
  position: absolute;
  top: 0;
  z-index: 100;
  transform: translateY(-50%);

  svg {
    width: 100%;
    height: auto;
  }
`

class ContactIcon extends React.Component {
  static mouseWheel
  static timeline
  static rotateTween

  constructor(props) {
    super(props)
    this.state = {
      rotation: 3600,
    }

    this.timeScale = { value: 1 }
    this.ref = React.createRef()
    this.onMouseWheelCompleted = this.onMouseWheelCompleted.bind(this)
    this.onMouseWheelDebounce = debounce(this.onMouseWheelCompleted, 750)
  }

  componentDidMount() {
    this.rotation()
    this.mouse()
  }

  rotation() {
    this.timeline = new TimelineLite({ repeat: true })
    this.timeline.to(this.ref.current, 6000, {
      rotation: '+=54000',
      ease: Power4.easeOut,
    })
  }

  mouse() {
    if (typeof window === 'object') {
      const Hamster = require('hamsterjs')

      this.mouseWheel = Hamster(window)
      this.mouseWheel.wheel((event, delta, deltaX, deltaY) => {
        this.timeScale.value = 3.25;
        this.timeline.timeScale(this.timeScale.value)

        // reset transformation value after a few seconds
        this.onMouseWheelDebounce()
      })
    }
  }

  onMouseWheelCompleted() {
    TweenLite.to(this.timeScale, 0.75, {
      value: 1,
      onUpdate: () => {
        this.timeline.timeScale(this.timeScale.value)
      },
    })
  }

  render() {
    return (
      <Container speed={this.state.speed} {...this.props}>
        <Box width={['25vw', null, '15vw', '12vw']} pl={['5vw']}>
          <Box as="figure" ref={this.ref} m={0}>
            <Form />
          </Box>
        </Box>
      </Container>
    )
  }
}

export default ContactIcon
