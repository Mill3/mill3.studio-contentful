import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'
import { useStaticQuery, graphql } from 'gatsby'

import Container from '@styles/Container'

const ClientRowStyle = styled.div`
  p {
    font-weight: 700;
    transition: color 0.25s;
  }

  hr {
    will-change: border-color;
    transition: border-color 0.25s;
  }

  &:hover {
    color: ${props => props.theme.colors.blue};
    hr {
      border-color: ${props => props.theme.colors.blue};
    }
  }
`

const ClientRowInner = styled.div`
  will-change: padding;
  transition: padding 0.45s;
`

export const filterByLocale = (data, locale = `en`) => {
  return data.filter(e => e.node.node_locale === locale)
}

class ClientRow extends React.Component {
  render() {
    const { index, hoverIndex, projectName, name, service, year, sep } = this.props

    const isCurrent = () => index === hoverIndex
    const isPrev = () => index === hoverIndex - 1
    const isNext = () => index === hoverIndex + 1

    const paddingVertical = () => {
      // when current give it more padding
      if (isCurrent()) {
        return [4]
      }

      // prev or next, little bit more
      if (isPrev() || isNext()) {
        return [3]
      }

      // default is 2
      return [2]
    }

    return (
      <Box as={ClientRowStyle}>
        <Flex as={ClientRowInner} py={paddingVertical()} px={[0, 2, 4]} flexWrap={`wrap`}>
          <Box as={`p`} margin={0} width={[1,1,`40%`]}>
            {projectName}
          </Box>
          <Box as={`p`} margin={0} width={[1,1,1 / 4]}>
            {name}
          </Box>
          <Box as={`p`} margin={0} width={[1,1,1 / 4]}>
            {service}
          </Box>
          <Box as={`p`} margin={0} width={[1,1,`auto`]} ml={[0,0,`auto`]}>
            {year}
          </Box>
        </Flex>
        {sep && <Box as={`hr`} margin={[0]} width={`100%`} />}
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

  list(data) {
    let rows = []

    data.map((item, index) => {
      rows.push(
        <div onMouseEnter={e => this.setHoverIndex(index)} onMouseLeave={e => this.setHoverIndex(null)}>
          <ClientRow
            key={index}
            index={index}
            hoverIndex={this.state.hoverIndex}
            projectName={item.node.projectName || item.node.name}
            project={item.node.project}
            name={item.node.name}
            service={item.node.service ? item.node.service.title : null}
            year={item.node.year}
            sep={true}
          />
        </div>
      )
    })

    return rows
  }

  render() {
    return <React.Fragment>{this.list(this.props.data)}</React.Fragment>
  }
}

const ClientQuery = ({ locale }) => {
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
  return <CliensRows data={filterByLocale(data.allContentfulClients.edges, locale)} />
}

const ClientsList = ({ locale }) => {
  return (
    <Box>
      <ClientRow
        projectName={`Project`}
        name={`Name`}
        service={`Expertise`}
        year={`Year`}
        sep={false}
        hover={false}
      />
      <ClientQuery locale={locale} />
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
