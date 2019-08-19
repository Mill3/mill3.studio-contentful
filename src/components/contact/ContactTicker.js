import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'rebass'
import { TweenMax, Linear } from 'gsap'
import { InView } from 'react-intersection-observer'


const TIME_SCALE_PERCENT = 0.45
const NETWORKS = [{
  name: 'Facebook',
  color: '#4267b2',
  url: 'https://facebook.com/Mill3studio/',
}, {
  name: 'LinkedIn',
  color: '#0073b1',
  url: 'https://linkedin.com/company/le-moulin/',
}, {
  name: 'Instagram',
  color: '#b900b4',
  url: 'https://www.instagram.com/mill3.studio/',
  className: 'instagram',
}, {
  name: 'Github',
  color: '#4078c0',
  url: 'https://github.com/MILL3',
}, {
  name: 'Behance',
  color: '#0057ff',
  url: 'https://behance.net/MILL3',
}, {
  name: 'Twitter',
  color: '#1DA1F2',
  url: 'https://twitter.com/Mill3Studio',
}]

const Wrapper = styled.div`
  background-color: ${props => props.theme.colors.black};
  overflow: hidden;
`
const NetworkStyle = styled.a`
  display: block;
  line-height: 1;
  cursor: pointer;
  color: ${props => props.theme.colors.white};
  transition: color 250ms linear;

  &:hover {
    color: ${props => props.hoverColor || props.theme.colors.blue};
    text-decoration: none;
  }

  &.instagram:hover {
    background-image: linear-gradient(135deg, #1400c8 0%, #b900b4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`
const Network = ({name, color, url, className}) => {
  return (
    <Text
      as={NetworkStyle}
      href={url || "#"}
      target="_blank"
      className={className}
      hoverColor={color}
      fontSize={['6vw', null, '3.5vw', '1.944444444vw']}
      fontWeight={300}
      mx={['7vw', null, '4.2vw', '3.125vw']}
    >
      {name}
    </Text>
  )
}


class ContactTicker extends Component {

  constructor(props) {
    super(props)

    this.tween = null
    this.timeScale = { value: 1 }

    this.ref1 = createRef()
    this.ref2 = createRef()
    this.ref3 = createRef()

    this.hover = this.hover.bind(this)
    this.inView = this.inView.bind(this)
    this.getRefs = this.getRefs.bind(this)
    this.getNetworks = this.getNetworks.bind(this)
  }

  componentDidMount() {
    this.tween = TweenMax.fromTo(this.getRefs(), 15, {x: '0%'}, {x: '-100%', ease: Linear.easeNone, repeat: -1, paused: true})
  }
  componentWillUnmount() {
    if( this.tween ) this.tween.kill()
    this.tween = null
  }

  hover(isHover) {

    // on hover, slow down animation
    // on leave, speed up to its original playback speed
    TweenMax.to(this.timeScale, 1, {
      value: isHover ? TIME_SCALE_PERCENT : 1,
      onUpdate: () => {
        this.tween.timeScale(this.timeScale.value)
      },
    })
  }
  inView(isInView) {
    if( !this.tween ) return;

    if( isInView ) this.tween.play()
    else this.tween.pause()
  }
  getRefs() {
    return [
      this.ref1.current,
      this.ref2.current,
      this.ref3.current
    ]
  }
  getNetworks() {
    return NETWORKS.map((network, index) => {
      return <Network key={index} name={network.name} color={network.color} url={network.url} className={network.className} />
    })
  }

  render() {
    return (
      <InView as="footer" onChange={this.inView}>
        <Flex as={Wrapper} flexWrap="nowrap" alignItems="center" width={'100%'} py={['12vw', null, '6.5vw', '5vw']} onMouseEnter={e => this.hover(true)} onMouseLeave={e => this.hover(false)}>
          <Flex ref={this.ref1} flexWrap="nowrap" alignItems="center">{ this.getNetworks() }</Flex>
          <Flex ref={this.ref2} flexWrap="nowrap" alignItems="center">{ this.getNetworks() }</Flex>
          <Flex ref={this.ref3} flexWrap="nowrap" alignItems="center">{ this.getNetworks() }</Flex>
        </Flex>
      </InView>
    )
  }
}

export default ContactTicker
