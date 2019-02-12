import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { StaticQuery, graphql } from 'gatsby'
import { TimelineLite, TweenMax, Linear } from 'gsap'
import { shuffle } from 'lodash'

const TickerLine = styled.div`
  width: 60000px;
`

const TickerLineClients = styled.div`
  width: auto;
  display: inline-block;
`

const ClientName = styled.p`
  display: inline-block;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
`

class ClientsTicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {  }
    this.listMain = React.createRef()
    this.listCopy = React.createRef()
    this.shuffleData = shuffle(this.props.data.edges)
  }

  componentDidMount() {
    let tl = new TimelineLite();

    // random duration
    let duration = Math.floor(Math.random() * 85) + 250;

    // add to this timeline
    tl.add( TweenMax.to( [this.listMain.current, this.listCopy.current], duration, { x:"-100%", ease: Linear.easeNone, repeat: -1 } ) );
  }

  clients(ref) {
    // console.log(ref, this.refs);

    if (this.shuffleData) {
      return this.shuffleData.map((client, index) =>
        <Text
          as={ClientName}
          fontSize={[3,4,'8vw']}
          ml={[2,4]}
          mr={[2,4]}
          key={index}>
            {client.node.name}
        </Text>
      )
    }
  }

  render() {
    return (
      <TickerLine>
        <TickerLineClients ref={this.listMain}>
          {this.clients()}
        </TickerLineClients>
        <TickerLineClients ref={this.listCopy}>
          {this.clients()}
        </TickerLineClients>
      </TickerLine>
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
      <>
        <ClientsTicker data={data.allContentfulClients} />
        <ClientsTicker data={data.allContentfulClients} />
        <ClientsTicker data={data.allContentfulClients} />
        <ClientsTicker data={data.allContentfulClients} />
        <ClientsTicker data={data.allContentfulClients} />
      </>
    )}
  />
)