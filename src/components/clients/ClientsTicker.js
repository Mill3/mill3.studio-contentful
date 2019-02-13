import React from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'
import { StaticQuery, graphql } from 'gatsby'
import { TimelineMax, TweenLite, Linear } from 'gsap'
import { shuffle } from 'lodash'

import ClientName, { ClientNameHeading }  from './ClientName'
console.log(ClientNameHeading);


const ClientsTickerContainer = styled.footer`
  overflow-x: hidden;

  ${ClientNameHeading} {
    transition-property: all;
    transition-timing-function: ease-in-out;
    transition-duration: 0.5s;
  }

  &:hover {
    ${ClientNameHeading} {
      /* filter: blur(15px); */
      opacity: 0.0475;
      &:hover {
        /* filter: blur(0); */
        opacity: 1;
      }
    }
  }
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

    // combine two list of clients
    let elements = [this.listMain.current, this.listCopy.current]

    // add to this timeline
    this.tl.add(
      TimelineMax.to(
        elements,
        duration,
        {
          x:"-100%",
          ease: Linear.easeNone,
          repeat: -1
        }
      )
    )
  }

  hover(isHover) {
    let timeScalePercent = 0.45

    // on hover, slow down animation
    if (isHover) {

      let timeScale = { value: 1 }
      TweenLite.to(
          timeScale,
          1,
          {
            value: timeScalePercent,
            onUpdate: () => {
              this.tl.timeScale(timeScale.value)
            }
        }
      )

    // on leave, speed up to its original playback speed
    } else {

      let timeScale = { value: timeScalePercent }
      TweenLite.to(
          timeScale,
          1,
          {
            value: 1,
            onUpdate: () => {
              this.tl.timeScale(timeScale.value)
            }
        }
      )
    }

  }

  clients() {
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
      <Box as={ClientsTickerContainer} pt={[4]}>
        <ClientsTicker data={data.allContentfulClients} />
        <ClientsTicker data={data.allContentfulClients} />
        <ClientsTicker data={data.allContentfulClients} />
      </Box>
    )}
  />
)