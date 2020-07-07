import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import { injectIntl } from 'gatsby-plugin-intl'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import posed from 'react-pose'
import { useInView } from 'react-intersection-observer'

import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { LayoutContext } from '@layouts/layoutContext'
import ExternalLink from '@svg/ExternalLink'
import { HAS_HOVER } from '@utils/constants'
import { lerp, limit } from '@utils/Math'


const filterByLocale = (data, locale = 'en') => data.filter(e => e.node.node_locale === locale)



//-------------------------//
//   THUMBNAIL COMPONENT   //
//-------------------------//
const ClientRowThumbnailStyle = styled.div`
  position: absolute;
  top: -142px;
  left: -142px;
  pointer-events: none;
  transform: translate3d(0px, 0px, 0);
`
const ClientRowThumbnailWrapPoses = posed.div({
  hidden: {
    opacity: 0,
    scale: 0.2,
    rotate: 15,
    transition: {
      type: 'tween',
      duration: 125,
      ease: 'circOut',
      opacity: {
        duration: 100,
        ease: 'linear',
      },
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'tween',
      duration: 150,
      ease: 'circOut',
      opacity: {
        duration: 100,
        ease: 'linear',
      },
    },
  },
})
const ClientRowThumbnailWrapStyle = styled(ClientRowThumbnailWrapPoses)`
  transform-origin: center center;
`

const IMG_THUMBNAIL_PROPS = {
  fadeIn: false,
  backgroundColor: "black",
  objectFit: "cover",
  objectPosition: "center center",
  loading: "eager",
  style: {
    width: '100%',
    height: '100%',
  },
}

const ClientRowThumbnail = ({ active, src }) => {
  const mouseEventRef = useRef()
  const scrollbarRef = useRef()
  const raf = useRef()
  const imgSrc = useRef()
  const currentSrc = useRef(src)
  const mouseMoveStartedRef = useRef(false)
  const visibilityRef = useRef(false)
  const targetTransformations = useRef({ x: 0, y: 0 })

  const { layoutState } = useContext(LayoutContext)
  const [ transformations, setTransformations ] = useState({ x: 0, y: 0, skew: 0 })

  // re-render image only if imgSrc changes
  const img = useMemo(() => imgSrc.current && <Img fixed={imgSrc.current?.fixed} {...IMG_THUMBNAIL_PROPS} />, [imgSrc.current])


  const animate = useCallback(() => {
    const { current: mouseevent } = mouseEventRef
    const { current: scrollbar } = scrollbarRef

    // update target's transformations based on mouse position
    if( mouseevent && scrollbar ) {
      targetTransformations.current.x = mouseevent.clientX
      targetTransformations.current.y = mouseevent.clientY + scrollbarRef.current.offset.y

      mouseEventRef.current = null
    }

    // update state
    setTransformations(previousTransformations => {
      const x = lerp(previousTransformations.x, targetTransformations.current.x, 0.08)
      const y = lerp(previousTransformations.y, targetTransformations.current.y, 0.08)

      return {
        x,
        y,
        skew: limit(-10, 10, ( targetTransformations.current.x - x ) * 0.02),
      }
    })

    // request new frame
    if( visibilityRef.current === true ) raf.current = requestAnimationFrame(animate)
  })
  const mousemove = useCallback((event) => {
    mouseEventRef.current = event

    // start rAF if not started && img is not null
    if( visibilityRef.current === false && currentSrc.current ) {
      visibilityRef.current = true

      // get mouse position
      const { clientX, clientY } = event

      // set initial position
      setTransformations({
        x: clientX,
        y: clientY + scrollbarRef.current.offset.y,
        skew: 0,
      })

      // rAF
      raf.current = requestAnimationFrame(animate)
    }
  })
  const poseCompleted = useCallback((pose) => {
    // when thumbnail hide transition is completed, cancel rAF
    if( pose === 'hidden' ) {
      if( raf.current ) cancelAnimationFrame(raf.current)
      raf.current = null

      // will restart rAF on next mousemove
      visibilityRef.current = false
    }
  })


  // save scrollbar ref
  useEffect(() => {
    scrollbarRef.current = layoutState.scrollbar
  }, [layoutState.scrollbar])

  // listen for window's mousemove
  useEffect(() => {
    // add listener, one time only, when active is true
    if( active && mouseMoveStartedRef.current === false ) {
      mouseMoveStartedRef.current = true
      window.addEventListener('mousemove', mousemove, { passive: false })
    }

    // remove listener when component is unmounted
    return () => {
      window.removeEventListener('mousemove', mousemove, { passive: false })

      mouseMoveStartedRef.current = false
      visibilityRef.current = false
    }
  }, [active])

  // update image's src only if src is not null
  // we do this to prevent glitch when src is null and we fade out current image
  useEffect(() => {
    if( src ) imgSrc.current = src
    currentSrc.current = src
  }, [src])


  // get state values
  const { x, y, skew } = transformations

  return (
    <Box
      as={ClientRowThumbnailStyle}
      width={[284]}
      height={[284]}
      style={{transform: `translate3d(${x}px, ${y}px, 0) skewX(${skew}deg)`}}
    >
      <Box
        as={ClientRowThumbnailWrapStyle}
        width={'100%'}
        height={'100%'}
        initialPose="hidden"
        pose={active && src !== null ? 'visible' : 'hidden'}
        onPoseComplete={poseCompleted}
        withParent={false}
      >
        {img}
      </Box>
    </Box>
  )
}
//-------------------------//



const CLIENT_ROW_FONT_SIZES = [0, 1, 2]
const ClientRowStyle = styled.div`
  h4 {
    text-transform: uppercase;
  }

  svg {
    width: 12px;
    height: auto;
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.25s linear;
    will-change: opacity;
  }
`

const ClientRowsHeading = React.memo(injectIntl(({ intl }) => {
  return (
    <Flex as="div" alignItems="center" height="84px" fontSize={CLIENT_ROW_FONT_SIZES} fontWeight="500">
      <Text width={[`50%`, null, `40%`]} pr={2}>{intl.formatMessage({ id: 'clients.project' })}</Text>
      <Text width={[1 / 3, null, 1 / 4]}>{intl.formatMessage({ id: 'clients.name' })}</Text>
      <Text width={1 / 4} display={['none', null, 'block']}>{intl.formatMessage({ id: 'clients.expertise' })}</Text>
      <Text width="auto" ml="auto">{intl.formatMessage({ id: 'clients.year' })}</Text>
    </Flex>
  )
}))
const ClientRow = React.memo(({ index, data, hoverCallback, ...props }) => {
  const { projectName, name, project, url, service, year } = data

  const onHover = useCallback(() => {
    hoverCallback(index)
  }, [index, hoverCallback])

  const LinkElement = useMemo(() => project ? TransitionLinkComponent : `a`, [project])
  const linkActions = useMemo(() => HAS_HOVER ? { onMouseEnter: onHover, onFocus: onHover } : null)
  const linkProps = useMemo(() => {
    if (project) {
      return {
        to: `/projects/${project.slug}`,
        title: project.transitionName,
        color: project.colorMain,
      }
    }

    if (url) {
      return {
        href: url,
        target: '_blank',
      }
    }

    return {}
  }, [project, url])

  return (
    <LinkElement {...linkProps} {...linkActions}>
      <Flex as={ClientRowStyle} alignItems="center" fontSize={CLIENT_ROW_FONT_SIZES} {...props}>
        <Text as="h4" fontSize={[0, 1, 2, `1.45vw`]} m={0} p={0} pr={2} width={[`50%`, null, `40%`]}>
          {projectName || name}
          {url && !project && <ExternalLink color={"blue"} />}
        </Text>
        <Text as="span" width={[1 / 3, null, 1 / 4]}>{name}</Text>
        <Text as="span" width={1 / 4} display={['none', null, 'block']}>{service?.title}</Text>
        <Text as="span" width="auto" ml="auto">{year}</Text>
      </Flex>
    </LinkElement>
  )
})



const ClientPoses = posed.li({
  init: {
    opacity: 1,
    height: 84,
    transition: {
      opacity: {
        duration: 250,
        ease: 'linear',
      },
      height: {
        duration: 450,
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  },
  entering: {
    opacity: 0.13,
    height: 84,
  },
  active: {
    opacity: 1,
    height: 110,
  },
  sibling: {
    opacity: 0.6,
    height: 97,
  }
})
const ClientsRowsItem = styled(ClientPoses)``
const ClientsRowsStyle = styled.ul`
  list-style: none;

  ${ClientsRowsItem} {
    border-bottom: 1px solid #e0e0e0;

    a, ${ClientRowStyle} {
      height: 100%;
    }

    a {
      display: block;
      color: currentColor;
      transition: color 250ms linear;

      &:hover,
      &:focus {
        color: ${(props) => props.theme.colors.blue};
        text-decoration: none;
      }
    }
  }
`

const ClientsRows = ({ data, limit }) => {
  const [ hoverIndex, setHoverIndex ] = useState(null)
  const [ ref, inView ] = useInView({ threshold: 0 })
  const clients = limit ? data.slice(0, limit) : data
  const thumbnailSrc = hoverIndex && clients.length > hoverIndex ? clients[ hoverIndex ].node.hoverImage : null

  const listProps = useMemo(() => HAS_HOVER ? { onMouseLeave: () => setHoverIndex(null)} : null, [HAS_HOVER])

  return (
    <>
      <Flex ref={ref} as={ClientsRowsStyle} flexDirection="column" m={0} p={0} {...listProps}>
        {clients.map((client, index) => {
          const isHover = hoverIndex !== null
          const isCurrent = hoverIndex === index
          const isSibling = isHover ? (Math.abs(hoverIndex - index) === 1) : false

          let pose = "init"

          if( isHover ) {
            if( isCurrent ) pose = "active"
            else if( isSibling ) pose = "sibling"
            else pose = "entering"
          }

          return (
            <Box as={ClientsRowsItem} key={index} initialPose="init" pose={pose} withParent={false}>
              <ClientRow index={index} data={client.node} hoverCallback={setHoverIndex} />
            </Box>
          )
        })}
      </Flex>

      {HAS_HOVER && <ClientRowThumbnail active={inView && hoverIndex !== null} src={thumbnailSrc} />}
    </>
  )
}

const ClientsList = ({ fwdRef, limit, intl }) => {
  const data = useStaticQuery(graphql`
    query ClientsList {
      allContentfulClients(sort: { fields: [year, name], order: DESC }) {
        edges {
          node {
            ...Client
          }
        }
      }
    }
  `)

  const clients = filterByLocale(data.allContentfulClients.edges, intl.locale)

  return (
    <Box ref={fwdRef} pt={[80, null, null, 0]}>
      <TransitionContainer direction="out" distance={-25}>
        <ClientRowsHeading />
        <ClientsRows limit={limit} data={clients} />
      </TransitionContainer>
    </Box>
  )
}

export default injectIntl(ClientsList)

export const query = graphql`
  fragment Client on ContentfulClients {
    id
    node_locale
    name
    slug
    colorMain
    year
    url
    projectName
    service {
      title
    }
    project {
      ...Project
    }
    hoverImage {
      fixed(width: 400, height: 400, quality: 85) {
        ...GatsbyContentfulFixed_noBase64
      }
    }
  }
`
