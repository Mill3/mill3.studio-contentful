import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading, Text } from 'rebass'
import { display } from 'styled-system'
import { injectIntl } from 'gatsby-plugin-intl'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import posed, { PoseGroup } from 'react-pose'
import { useInView } from 'react-intersection-observer'

import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { LayoutContext } from '@layouts/layoutContext'
import { colors } from '@styles/Theme'
import ExternalLink from '@svg/ExternalLink'
import { HAS_HOVER } from '@utils/constants'
import { lerp, limit } from '@utils/Math'


const filterByLocale = (data, locale = 'en') => data.filter(e => e.node.node_locale === locale)


const ClientRowElement = styled.p`
  ${display};
  font-weight: 300;
`

const ClientRowElementName = styled.h4`
  ${display};
  font-weight: 300;
  text-transform: uppercase;
`

const ClientRowStyle = styled.div`
  p {
    font-weight: 500;
    color: ${props => props.color};
    transition: color 0.25s ease-in-out;
  }

  a {
    text-decoration: none;
    color: ${props => props.color};
  }

  svg {
    width: 12px;
    height: auto;
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  hr {
    will-change: border-color;
    transition: border-color 0.25s;
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #e0e0e0;
  }

  &:hover {
    color: ${props => props.theme.colors.blue};
    svg {
      opacity: 1;
    }
  }
`

const ClientRowInner = styled.div`
  will-change: height;
  transition: height 0.45s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  height: ${props => props.height}px;
`

const ClientPoses = posed.div({
  enter: {
    opacity: 1,
    duration: 1000,
    delay: ({ delay = 0 }) => delay,
  },
  exit: {
    opacity: 0,
    delay: 0,
    duration: 350,
  },
})

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


const ClientRow = (props) => {
  const { index, hoverIndex, projectName, name, project, url, service, year, textColor, sep, labelRow } = props
  const [ height, setHeight ] = useState(84)
  const [ isCurrent, setIsCurrent ] = useState(false)
  const [ isPrev, setPrev ] = useState(false)
  const [ isNext, setNext ] = useState(false)

  useEffect(() => {
    (hoverIndex !== null && index === hoverIndex) ? setIsCurrent(true) : setIsCurrent(false);
    (hoverIndex !== null && index === hoverIndex - 1) ? setPrev(true) : setPrev(false);
    (hoverIndex !== null && index === hoverIndex + 1) ? setNext(true) : setNext(false);

    calculateHeight()

  }, [index, hoverIndex, height, isCurrent, isNext, isPrev])

  const calculateHeight = () => {
    if(isCurrent) return setHeight(110)
    if (isPrev || isNext) return setHeight(97)
    return setHeight(84)
  }

  const color = () => {
    // when forcing a specific color
    if (textColor) return textColor

    // when current give it more padding
    if (isCurrent) return colors.blue

    // prev or next, gray text
    if (isPrev || isNext) return colors.gray

    // not prev neither next, but has a hoverIndex value, text is lighter grey
    if (hoverIndex !== null) return `#E0E0E0`

    // hoverIndex is null, no element is active, return default color
    return colors.text
  }

  const LinkElement = sep ? (project ? TransitionLinkComponent : `a`) : React.Fragment
  const LinkProps = () => {
    if (!sep) return {}

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
  }

  return (
    <Box as={ClientRowStyle} color={color()}>
      <TransitionContainer direction="out" distance={-25}>
        <LinkElement {...LinkProps()}>
          <Flex as={ClientRowInner} height={height} px={[0, 0, 0]} flexWrap={`wrap`} alignItems="center">
            <Heading
              as={labelRow ? ClientRowElement : ClientRowElementName}
              fontSize={labelRow ? [0, 1, 2] : [0, 1, 2, `2vw`]}
              fontFamily="sans"
              pr={[2]}
              margin={0}
              width={[`50%`, `50%`, `40%`]}
            >
              {projectName}
              {url && !project && <ExternalLink color={colors.blue} />}
            </Heading>
            <Text as={ClientRowElement} fontSize={[0, 1, 2]} margin={0} width={[1 / 3, 1 / 3, 1 / 4]}>
              {name}
            </Text>
            <Text
              as={ClientRowElement}
              fontSize={[0, 1, 2]}
              margin={0}
              width={[1 / 4]}
              display={['none', 'none', 'block']}
            >
              {service}
            </Text>
            <Text as={ClientRowElement} fontSize={[0, 1, 2]} margin={0} width={[`auto`]} ml={[`auto`]}>
              {year}
            </Text>
          </Flex>
          {sep && <Box as={`hr`} margin={[0]} width={`100%`} />}
        </LinkElement>
      </TransitionContainer>
    </Box>
  )
}


const ROW_PROPS = HAS_HOVER ? { role: "button", tabIndex: 0 } : {}

const ClientsRows = ({ data, limit }) => {
  const [ hoverIndex, setHoverIndex ] = useState(null)
  const [ ref, inView ] = useInView({ threshold: 0 })
  const clients = limit ? data.slice(0, limit) : data
  const thumbnailSrc = hoverIndex && clients.length > hoverIndex ? clients[ hoverIndex ].node.hoverImage : null

  // there is not need to add all theses props if device has no hover behavior
  const wrapProps = HAS_HOVER ? { role: "grid", tabIndex: 0, onMouseLeave: () => setHoverIndex(null) } : {}

  return (
    <div
      ref={ref}
      {...wrapProps}
    >
      <PoseGroup animateOnMount={false} flipMove={false}>
        {clients.map((client, index) => {
          const props = HAS_HOVER ? {
            ...ROW_PROPS,
            ...{
              onMouseEnter: () => setHoverIndex(index),
              onFocus: () => setHoverIndex(index),
            }
          } : ROW_PROPS

          return (
            <ClientPoses
              key={index}
              delay={index * 100}
              {...props}
            >
              <ClientRow
                index={index}
                hoverIndex={hoverIndex}
                projectName={client.node.projectName || client.node.name}
                project={client.node.project}
                url={client.node.url}
                name={client.node.name}
                service={client.node.service ? client.node.service.title : null}
                year={client.node.year}
                sep={true}
              />
            </ClientPoses>
          )
        })}
      </PoseGroup>

      {HAS_HOVER && <ClientRowThumbnail active={inView && hoverIndex !== null} src={thumbnailSrc} />}
    </div>
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
      <ClientRow
        projectName={intl.formatMessage({ id: 'clients.project' })}
        name={intl.formatMessage({ id: 'clients.name' })}
        service={intl.formatMessage({ id: 'clients.expertise' })}
        year={intl.formatMessage({ id: 'clients.year' })}
        sep={false}
        textColor={colors.text}
        hoverIndex={false}
        labelRow={true}
      />
      <ClientsRows limit={limit} data={clients} />
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
