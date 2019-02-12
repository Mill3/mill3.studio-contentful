import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

class ClientsTicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  }
    console.log(this.props.data);

  }
  render() {
    return (
      <>Foobar</>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        allContentfulClients {
          edges {
            node {
              name
              slug
            }
          }
        }
      }
    `}
    render={(data) => (
      <ClientsTicker data={data.allContentfulClients.edges}/>
    )}
  />
)