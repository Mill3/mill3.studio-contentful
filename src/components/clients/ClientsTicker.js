import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'
import { StaticQuery, graphql } from 'gatsby'
import { shuffle } from 'lodash'
import { useInView } from 'react-intersection-observer'

import ClientName, { ClientNameHeading } from './ClientName'
import { lerp } from '@utils/Math'

const ClientsTickerContainer = styled.footer`
  overflow-x: hidden;

  ${ClientNameHeading} {
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
    will-change: opacity;
  }

  &:hover {
    ${ClientNameHeading} {
      opacity: 0.0475;

      &:hover {
        opacity: 1;
      }
    }
  }
`

const TickerLine = styled.div`
  width: 80000px;
`

const TickerLineClients = styled.div`
  width: auto;
  display: inline-block;
`


const ClientsTicker = React.memo(({ data, direction = 1, speedBase = 0 }) => {
  const raf = useRef()
  const listRef = useRef()
  const listCopyRef = useRef()
  const velocity = useRef({ base: null, value: null, target: null })
  const position = useRef(direction > 0 ? 0 : -100)
  const [inViewRef, inView] = useInView()


  const animate = useCallback(() => {
    // get velocity values
    const { base, value, target } = velocity.current

    // lerp velocity
    velocity.current.value = lerp(value, target, 0.06)

    // update position
    position.current += velocity.current.value

    // if base velocity is positive, meaning ticker move to right
    if( base > 0 ) {
      // if ticker reach end, reset to start
      if( position.current > 100 ) position.current = position.current % 100
    } else {
      // if ticker reach end, reset to start
      if( position.current < 100 ) position.current = position.current % 100
    }

    const transform = `translate3d(${position.current}%, 0, 0)`

    // update ticker position (outside of React rendering tree because it's too slow)
    listRef.current.style.transform = transform
    listCopyRef.current.style.transform = transform

    // continue rAF if previous ticker was not canceled
    if( raf.current ) raf.current = requestAnimationFrame(animate)
  })

  // speed up/down velocity when hovering component
  const mouseenter = useCallback(() => { velocity.current.target = velocity.current.base * 0.45 })
  const mouseleave = useCallback(() => { velocity.current.target = velocity.current.base })
  

  // update velocity based on speedBase property
  useEffect(() => {
    // calculate duration to complete a full circle (taken for previous implementation of this component)
    const duration = Math.floor(Math.random() * 50) + 150 + speedBase

    // calculate velocity
    velocity.current.base = -1 / duration * direction
    velocity.current.target = velocity.current.base

    // on first pass, value and target are equal
    if( velocity.current.value === null ) velocity.current.value = velocity.current.target
  }, [speedBase, direction])

  // rAF
  useEffect(() => {
    // cancel previous rAF
    if( raf.current ) cancelAnimationFrame(raf.current)
    raf.current = null

    // if inView, create rAF loop
    if( inView ) raf.current = requestAnimationFrame(animate)

    // cancel rAF when unmounting component
    return () => {
      if( raf.current ) cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }, [inView])

  // return a memoized list of ClientName components
  const clients = useMemo(() => {
    return shuffle(data.edges).map((client, index) => <ClientName key={index} name={client.node.name} />)
  }, [data.edges])

  return (
    <Box ref={inViewRef} as={TickerLine} onMouseEnter={mouseenter} onMouseLeave={mouseleave}>
      <Box ref={listRef} as={TickerLineClients}>{clients}</Box>
      <Box ref={listCopyRef} as={TickerLineClients}>{clients}</Box>
    </Box>
  )
})

export default React.memo(props => (
  <StaticQuery
    query={graphql`
      query {
        allContentfulClients(filter: { node_locale: { eq: "en" } }) {
          edges {
            node {
              name
              slug
            }
          }
        }
      }
    `}
    render={data => {
      const tickers = Array(props.quantity || 3)
        .fill()
        .map((item, index) => (
          <ClientsTicker
            data={data.allContentfulClients}
            direction={index % 2 ? -1 : 1}
            speedBase={(index + 1) * 10 * 4.5}
            key={index}
          />
        ))

      return (
        <Box as={ClientsTickerContainer} pt={4}>
          {tickers}
        </Box>
      )
    }}
  />
))
