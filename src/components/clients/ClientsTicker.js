import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { StaticQuery, graphql } from 'gatsby'
import { TimelineLite, TweenMax, Linear } from 'gsap'
import { shuffle } from 'lodash'

import ClientName from './ClientName'

const ClientsTickerContainer = styled.footer`
  overflow: hidden;
`

const TickerLine = styled.div`
  width: 60000px;
`

const TickerLineClients = styled.div`
  width: auto;
  display: inline-block;
`

class ClientsTicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animationSpeed: 1
    }
    this.tl = null
    this.listMain = React.createRef()
    this.listCopy = React.createRef()
    this.shuffleData = shuffle(this.props.data.edges)
    this.hover = this.hover.bind(this)
  }

  componentDidMount() {
    this.tl = new TimelineLite();

    // random duration
    let duration = Math.floor(Math.random() * 50) + 150;

    // add to this timeline
    this.tl.add( TweenMax.to( [this.listMain.current, this.listCopy.current], duration, { x:"-100%", ease: Linear.easeNone, repeat: -1 } ) );
  }

  hover(isHover) {
    return isHover ? this.tl.timeScale(0.65) : this.tl.timeScale(1)
  }

  clients(ref) {
    // console.log(ref, this.refs);
    if (this.shuffleData) {
      return this.shuffleData.map((client, index) =>
        <ClientName name={client.node.name} color={client.node.colorMain} key={index} />
      )
    }
  }

  render() {
    return (
      <TickerLine onMouseEnter={(e) => this.hover(true)} onMouseLeave={(e) => this.hover(false)}>
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
        allContentfulClients(filter: { node_locale : { eq: "en" }}) {
          edges {
            node {
              name
              slug
              colorMain
            }
          }
        }
      }
    `}
    render={(data) => (
      <ClientsTickerContainer>
        <ClientsTicker data={data.allContentfulClients} />
        <ClientsTicker data={data.allContentfulClients} />
        <ClientsTicker data={data.allContentfulClients} />
      </ClientsTickerContainer>
    )}
  />
)