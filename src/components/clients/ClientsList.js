import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Heading, Text } from 'rebass'
import { display } from 'styled-system'
import { injectIntl } from 'react-intl'
import { useStaticQuery, graphql } from 'gatsby'
import posed, { PoseGroup } from 'react-pose'
import memoize from 'memoize-one'

import { colors } from '@styles/Theme'

import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import ExternalLink from '@svg/ExternalLink'


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
  const clients = limit ? data.slice(0, limit) : data

  return (
    <PoseGroup animateOnMount={false} flipMove={false}>
      {clients.map((client, index) => (
        <ClientPoses
          key={index}
          role="button"
          tabIndex="0"
          onMouseEnter={e => setHoverIndex(index)}
          onMouseLeave={e => setHoverIndex(null)}
          onFocus={e => setHoverIndex(index)}
          onBlur={e => setHoverIndex(null)}
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
      ))}
    </PoseGroup>
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
      fixed(width: 1200, quality: 85) {
        ...GatsbyContentfulFixed_noBase64
      }
    }
  }
`
