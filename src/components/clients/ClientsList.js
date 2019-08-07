import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'
import { useStaticQuery, graphql } from 'gatsby'

import Container from '@styles/Container'

const ClientsListContainer = styled.section`
  /* border: 1px solid rebeccapurple; */
`

const ClientRowStyle = styled.div`
  font-weight: 700;
  &:hover {
    color: ${props => props.theme.colors.blue};
    hr {
      border-color: ${props => props.theme.colors.blue};
    }
  }
`

const ClientRow = ({ projectName, name, service, year, sep = true }) => {
  return (
    <Box as={ClientRowStyle}>
      <Flex py={[3]} px={[0,2,4]} flexWrap={`wrap`}>
        <Box width={[`40%`]}>{projectName}</Box>
        <Box width={[1/4]}>{name}</Box>
        <Box width={[1/4]}>{service}</Box>
        <Box ml={`auto`}>{year}</Box>
      </Flex>
      {sep &&
        <Box as={`hr`} margin={[0]} width={`100%`} />
      }
    </Box>
  )
}

// class ClientsList extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       hoverIndex: null
//     }
//     this.setIndex = this.setIndex.bind(this)
//   }

//   setIndex(index) {
//     this.setState({
//       hoverIndex: index
//     })
//   }


const ClientsList = props => {

  const list = data => {
    return data.edges.map((item, index) => (
      <ClientRow
        key={index}
        projectName={item.node.projectName}
        name={item.node.name}
        service={item.node.service ? item.node.service.title : null}
        year={item.node.year}
      />
    ))
  }

  const data = useStaticQuery(graphql`
    query ClientsList {
      allContentfulClients(filter: { node_locale: { eq: "en" } }, sort: { fields: [name], order: ASC }) {
        edges {
          node {
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
        }
      }
    }
  `)
  return (
    <Container>
      <Box as={ClientsListContainer}>
        <ClientRow
          projectName={`Project`}
          name={`Name`}
          service={`Expertise`}
          year={`Year`}
          sep={false}
        />
        {list(data.allContentfulClients)}
      </Box>
    </Container>
  )
}

export default ClientsList

// export default props => (
//   <StaticQuery
//     query={graphql`
//       query {
//         allContentfulClients(filter: { node_locale: { eq: "en" } }) {
//           edges {
//             node {
//               name
//               slug
//               colorMain
//             }
//           }
//         }
//       }
//     `}
//     render={data => {
//       const tickers = Array(props.quantity || 3)
//         .fill()
//         .map((item, index) => <ClientsTicker data={data.allContentfulClients} direction={index % 2 ? -1 : 1} speedBase={(index + 1) * 10 * 4.5} key={index} />)

//       return (
//         <Box as={ClientsTickerContainer} pt={[4]}>
//           {tickers}
//         </Box>
//       )
//     }}
//   />
// )
