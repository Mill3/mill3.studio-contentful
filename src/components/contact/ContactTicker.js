import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, Text } from 'rebass'
import { useInView } from 'react-intersection-observer'


const tickerAnimation = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
`
const Wrapper = styled.footer`
  overflow: hidden;
  max-width: 100vw;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
`
const Ticker = styled.div`
  text-transform: uppercase;
  animation-name: ${tickerAnimation};
  animation-duration: 25s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: ${({ inView }) => inView ? 'playing' : 'paused'};
`
const NetworkStyle = styled.a`
  cursor: pointer;
  color: ${props => props.theme.colors.white};
  transition: color 250ms linear;

  &::before {
    content: "→";
    display: block;
    font-family: ${props => props.theme.fonts.serifText};
    font-weight: normal;
    margin-right: 3.5vw;

    @media (min-width: ${props => props.theme.breakpoints[1]}) {
      margin-right: 2.1vw;
    }
    @media (min-width: ${props => props.theme.breakpoints[2]}) {
      margin-right: 1.5625vw;
    }
  }

  &:hover {
    color: ${props => props.theme.colors.blue};
    text-decoration: none;
  }
`

const Network = ({name, url}) => {
  return (
    <Text
      as={NetworkStyle}
      href={url || "#"}
      target="_blank"
      display="flex"
      fontSize={['clamp(28px, calc(4vw + 28px), 120px)']}
      fontWeight={300}
      lineHeight={1}
      mx={['7vw', null, '4.2vw', '3.125vw']}
    >
      {name}
    </Text>
  )
}


const NETWORKS = [{
  name: 'info@mill3.studio',
  url: 'mailto: info@mill3.studio',
}, {
  name: 'Facebook',
  url: 'https://facebook.com/Mill3studio/',
}, {
  name: 'LinkedIn',
  url: 'https://linkedin.com/company/le-moulin/',
}, {
  name: 'Instagram',
  url: 'https://www.instagram.com/mill3.studio/',
}, {
  name: 'Github',
  url: 'https://github.com/MILL3',
}, {
  name: 'Behance',
  url: 'https://behance.net/MILL3',
}, {
  name: 'Twitter',
  url: 'https://twitter.com/Mill3Studio',
}].map((network, index) => {
  return <Network key={index} name={network.name} url={network.url} />
})

const ContactTicker = (props) => {
  const [ref, inView] = useInView({ threshold: 0 })
  return (
    <Flex ref={ref} as={Wrapper} flexWrap="nowrap" alignItems="center" width={'100%'} {...props}>
      <Flex as={Ticker} inView={inView} flexWrap="nowrap" alignItems="center">{ NETWORKS }</Flex>
      <Flex as={Ticker} inView={inView} flexWrap="nowrap" alignItems="center" aria-hidden="true">{ NETWORKS }</Flex>
    </Flex>
  )
}

export default ContactTicker
