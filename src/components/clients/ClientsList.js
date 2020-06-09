import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box, Heading, Text } from 'rebass'
import { display } from 'styled-system'
import { injectIntl } from 'react-intl'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import posed, { PoseGroup } from 'react-pose'
import memoize from 'memoize-one'
import { useInView } from 'react-intersection-observer'


import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { colors } from '@styles/Theme'
import ExternalLink from '@svg/ExternalLink'
import { HAS_HOVER } from '@utils/constants'
import { lerp, limit } from '@utils/Math'


const filterByLocale = memoize((data, locale = 'en') => {
  return data.filter(e => e.node.node_locale === locale)
})


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
  will-change: padding;
  transition: padding 0.45s cubic-bezier(0.165, 0.84, 0.44, 1);
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
      duration: 150,
      ease: 'circOut',
      opacity: {
        duration: 150,
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
      duration: 500,
      ease: 'circOut',
      opacity: {
        duration: 250,
        ease: 'linear',
      },
    },
  },
})

const ClientRowThumbnailWrapStyle = styled(ClientRowThumbnailWrapPoses)`
  transform-origin: center center;
`

class ClientRowThumbnail extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      skew: 0,
      visible: false,
    }

    this.current = { x: 0, y: 0 }
    this.target = { x: 0, y: 0 }
    this.scrollbar = null
    this.raf = null
    this.event = null
    this.src = null
    this.started = false
    this.visible = false
    this.isActive = false

    this.onMouseMove = this.onMouseMove.bind(this)
    this.onRaf = this.onRaf.bind(this)
    this.onPoseComplete = this.onPoseComplete.bind(this)

    this._updateEvents = memoize(active => {
      this.isActive = active

      if( active ) this._bindEvents()
      return active
    })
  }

  componentDidMount() {
    this.context.getScrollbar(s => this.scrollbar = s)
  }

  onMouseMove(event) {
    this.event = event
    this.visible = this.isActive

    // if this is first mousemove, start mouse tracking RAF
    if( !this.started && this.scrollbar ) {
      this.started = true

      // set initial position
      this.current.x = this.event.clientX
      this.current.y = this.event.clientY + this.scrollbar.offset.y

      this.raf = requestAnimationFrame(this.onRaf)
    }
  }
  onRaf() {
    if( this.event && this.scrollbar ) {
      this.target.x = this.event.clientX
      this.target.y = this.event.clientY + this.scrollbar.offset.y

      this.event = null
    }

    this.current.x = lerp(this.current.x, this.target.x, 0.08)
    this.current.y = lerp(this.current.y, this.target.y, 0.08)

    const skew = limit(-10, 10, ( this.target.x - this.current.x ) * 0.02)

    this.setState({
      x: this.current.x,
      y: this.current.y,
      skew: skew,
      visible: this.visible,
    }, () => {
      if( this.started ) this.raf = requestAnimationFrame(this.onRaf)
    })
  }
  onPoseComplete(pose) {
    // when thumbnail hidden transition is completed, unbind all events
    if( pose === 'hidden' ) this._unbindEvents()
  }

  _bindEvents() {
    // listen for mousemove to capture mouse position
    window.addEventListener('mousemove', this.onMouseMove, {passive: false})
  }
  _unbindEvents() {
    // remove mousemove listener
    window.removeEventListener('mousemove', this.onMouseMove, {passive: false})
    if( this.raf ) cancelAnimationFrame(this.raf)

    this.raf = null
    this.event = null
    this.started = false
  }

  render() {
    const { active, src } = this.props
    const { x, y, skew, visible } = this.state

    // this function will be called only if param value has changed, due to memoization
    this._updateEvents( active && src !== null )

    // update image source only if source is not empty
    if( src ) this.src = src

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
          pose={visible ? 'visible' : 'hidden'}
          onPoseComplete={this.onPoseComplete}
          withParent={false}
        >
          {this.src &&
            <Img
              fixed={this.src.fixed}
              fadeIn={false}
              backgroundColor="black"
              objectFit="cover"
              objectPosition="center center"
              loading="eager"
              style={{ width: '100%', height: '100%' }}
            />}
        </Box>
      </Box>
    )
  }
}

const ClientRow = (props) => {
  const { index, hoverIndex, projectName, name, project, url, service, year, textColor, sep, labelRow } = props

  const isCurrent = () => hoverIndex !== null && index === hoverIndex
  const isPrev = () => hoverIndex !== null && index === hoverIndex - 1
  const isNext = () => hoverIndex !== null && index === hoverIndex + 1

  const padding = () => {
    // when current give it more padding
    if (isCurrent()) return [`34px`]

    // prev or next, little bit more
    if (isPrev() || isNext()) return [`24px`]

    // default
    return [`17px`]
  }

  const color = () => {
    // when forcing a specific color
    if (textColor) return textColor

    // when current give it more padding
    if (isCurrent()) return colors.blue

    // prev or next, gray text
    if (isPrev() || isNext()) return colors.gray

    // not prev neither next, but has a hoverIndex value, text is lighter grey
    if (hoverIndex !== null) return `#E0E0E0`

    // hoverIndex is null, no element is active, return default color
    return colors.text
  }

  const LinkElement = project ? TransitionLinkComponent : `a`

  const LinkProps = () => {
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
          <Flex as={ClientRowInner} py={padding()} px={[0, 0, 0]} flexWrap={`wrap`} alignItems="center">
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

const CliensRows = ({ data, limit }) => {
  const [ hoverIndex, setHoverIndex ] = useState(null)
  const [ ref, inView ] = useInView({ threshold: 0 })
  const clients = limit ? data.slice(0, limit) : data
  const thumbnailSrc = hoverIndex && clients.length > hoverIndex ? clients[ hoverIndex ].node.hoverImage : null

  // there is not need to add all theses props if device has no hover behavior
  const wrapProps = HAS_HOVER ? { role: "grid", tabIndex: 0, onMouseLeave: () => setHoverIndex(null) } : {}
  const rowProps = HAS_HOVER ? { role: "button", tabIndex: 0 } : {}

  return (
    <div
      ref={ref}
      {...wrapProps}
    >
      <PoseGroup animateOnMount={false} flipMove={false}>
        {clients.map((client, index) => {
          const props = HAS_HOVER ? {
            ...rowProps,
            ...{
              onMouseEnter: () => setHoverIndex(index),
              onFocus: () => setHoverIndex(index),
            }
          } : rowProps

          return (
            <ClientPoses
              key={index}
              {...props}
              delay={index * 100}
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
  return (
    <Box ref={fwdRef} pt={[5, 5, 0]}>
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
      <CliensRows limit={limit} data={filterByLocale(data.allContentfulClients.edges, intl.locale)} />
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
