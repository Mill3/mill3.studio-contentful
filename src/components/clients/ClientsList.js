import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'
import { useStaticQuery, graphql } from 'gatsby'

import { colors } from '@styles/Theme'

import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'

import ExternalLink from '@svg/ExternalLink'

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

export const filterByLocale = (data, locale = `en`) => {
  return data.filter(e => e.node.node_locale === locale)
}

class ClientRow extends React.Component {

  render() {
    const { index, hoverIndex, projectName, name, project, url, service, year, sep } = this.props
    // console.log('index, hoverIndex:', index, hoverIndex, index === hoverIndex)

    const isCurrent = () => hoverIndex !== null && index === hoverIndex
    const isPrev = () => hoverIndex !== null && (index === hoverIndex - 1)
    const isNext = () => hoverIndex !== null && (index === hoverIndex + 1)

    const padding = () => {
      // when current give it more padding

      if (isCurrent()) return [`34px`]

      // prev or next, little bit more
      if (isPrev() || isNext()) return [`24px`]

      // default
      return [`17px`]
    }

    const color = () => {
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
          to : `/projects/${project.slug}`,
          title: project.transitionName,
          color: project.colorMain
        }
      }

      if (url) {
        return {
          href : url,
          target: '_blank'
        }
      }
    }

    return (
      <Box as={ClientRowStyle} color={color()}>
        <TransitionContainer direction="out" distance={-25}>
          <LinkElement {...LinkProps()}>
            <Flex as={ClientRowInner} py={padding()} px={[0, 2, 4]} flexWrap={`wrap`}>
              <Box as={`p`} margin={0} width={[1, 1, `40%`]}>
                {projectName}
                {(url && !project) && <ExternalLink color={colors.blue} />}
              </Box>
              <Box as={`p`} margin={0} width={[1, 1, 1 / 4]}>
                {name}
              </Box>
              <Box as={`p`} margin={0} width={[1, 1, 1 / 4]}>
                {service}
              </Box>
              <Box as={`p`} margin={0} width={[1, 1, `auto`]} ml={[0, 0, `auto`]}>
                {year}
              </Box>
            </Flex>
            {sep && <Box as={`hr`} margin={[0]} width={`100%`} />}
          </LinkElement>
        </TransitionContainer>
      </Box>
    )
  }
}

class CliensRows extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoverIndex: null,
    }
    this.setHoverIndex = this.setHoverIndex.bind(this)
  }

  setHoverIndex(index) {
    this.setState({
      hoverIndex: index,
    })
  }

  render() {
    const { data } = this.props
    return (
      <React.Fragment>
        {data.map((client, index) => (
          <div key={index} onMouseEnter={e => this.setHoverIndex(index)} onMouseLeave={e => this.setHoverIndex(null)}>
            <ClientRow
              index={index}
              hoverIndex={this.state.hoverIndex}
              projectName={client.node.projectName || client.node.name}
              project={client.node.project}
              url={client.node.url}
              name={client.node.name}
              service={client.node.service ? client.node.service.title : null}
              year={client.node.year}
              sep={true}
            />
          </div>
        ))}
      </React.Fragment>
    )
  }
}

const ClientsList = ({ locale }) => {
  const data = useStaticQuery(graphql`
    query ClientsList {
      allContentfulClients(sort: { fields: [year], order: DESC }) {
        edges {
          node {
            ...Client
          }
        }
      }
    }
  `)
  return (
    <Box>
      <ClientRow projectName={`Project`} name={`Name`} service={`Expertise`} year={`Year`} sep={false} hoverIndex={false} />
      <CliensRows data={filterByLocale(data.allContentfulClients.edges, locale)} />
    </Box>
  )
}

export default ClientsList

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
  }
`
