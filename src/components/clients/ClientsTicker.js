import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
import { StaticQuery, graphql } from 'gatsby'
import { chunk, shuffle } from 'lodash'
import { useInView } from 'react-intersection-observer'

import ClientName, { ClientNameHeading } from './ClientName'
import { lerp } from '@utils/Math'

const FPS = 1000 / 60 // we target 60 frame per seconds (1000 / 60 = 1.666667)

const ClientsTickerContainer = styled.footer`
  overflow-x: hidden;

  ${ClientNameHeading} {
    opacity: 1;
    transition: opacity 0.5s linear;
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


const ClientsTicker = React.memo(({ data = [], direction = 1, duration = 0 }) => {
  const raf = useRef()
  const listRef = useRef()
  const listCopyRef = useRef()
  const velocity = useRef({ base: null, value: null, target: null })
  const position = useRef(0)
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
    if( listRef.current ) listRef.current.style.transform = transform
    if( listCopyRef.current ) listCopyRef.current.style.transform = transform

    // continue rAF if previous ticker was not canceled
    if( raf.current ) raf.current = requestAnimationFrame(animate)
  })

  // speed up/down velocity when hovering component
  const mouseenter = useCallback(() => { velocity.current.target = velocity.current.base * 0.45 })
  const mouseleave = useCallback(() => { velocity.current.target = velocity.current.base })
  

  // update velocity based on duration property
  useEffect(() => {
    // calculate percentage speed based on duration to complete a full loop
    // we use 100 as base value because our animation uses translateX with percentage values
    const speed = 100 / (duration * FPS)

    // calculate velocity
    velocity.current.base = speed * direction * -1
    velocity.current.target = velocity.current.base

    // on first pass, value and target are equal
    if( velocity.current.value === null ) velocity.current.value = velocity.current.target
  }, [duration, direction])

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
    return data.map((client, index) => <ClientName key={index} name={client.node.name} />)
  }, [data])

  return (
    <Flex ref={inViewRef} flexDirection="row" flexWrap="nowrap" justifyContent={direction < 0 ? 'flex-end' : 'flex-start' } onMouseEnter={mouseenter} onMouseLeave={mouseleave}>
      <Flex ref={listRef} css={{border: '1px solid red'}}>{clients}</Flex>
      <Flex ref={listCopyRef} css={{border: '1px solid red'}}>{clients}</Flex>
    </Flex>
  )
})

export default React.memo(({ quantity = 3 }) => (
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
      const names = data?.allContentfulClients?.edges || []

      // because we have a lots of clients name in each ticker
      // we will chunk the list equally into each ticker
      const clients = useMemo(() => {
        const size = Math.ceil(names.length / quantity)
        const chunks = chunk(shuffle(names), size)

        return chunks
      }, [names, quantity])

      const tickers = clients.map((item, index) => {
        return (
          <ClientsTicker
            key={index}
            data={item}
            direction={index % 2 ? -1 : 1}
            duration={75}
          />
        )
      })

      return (
        <Box as={ClientsTickerContainer} pt={4}>
          {tickers}
        </Box>
      )
    }}
  />
))
