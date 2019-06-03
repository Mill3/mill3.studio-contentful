import React, { Component } from 'react'
import TransitionLinkComponent from '@utils/TransitionLink'
import { Box, Text } from 'rebass'
import Img from "gatsby-image"
import styled from 'styled-components'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import VisibilitySensor from 'react-visibility-sensor'

import FigureBox from '@utils/FigureBox'

const NewsPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 150,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ index }) => (((index % 3) + 1) * 125) + (index < 3 ? 1500 : 0),
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    }
  },
})

const NewsPreviewItem = styled(NewsPoses)`

  figure {
    position: relative;
    overflow: hidden;
    background: ${props => props.color};
  }

  a {
    color: #000;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
`

class NewsPreview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reveal: false
    }
    this.onChange = this.onChange.bind(this)
    this.reveal = this.reveal.bind(this)
  }

  onChange(isVisible) {
    if (isVisible && !this.state.reveal) {
      this.setState({
        reveal: true
      })
    }
  }

  reveal(isVisible) {
    return this.state.reveal ? 'visible' : 'hidden'
  }

  render() {

      let {
        slug,
        imageMain,
        title
      } = this.props.news.node

      return (
        <VisibilitySensor onChange={this.onChange} partialVisibility={true} offset={{top: -50}}>
          {({isVisible}) =>
            <Box
              as={NewsPreviewItem}
              index={this.props.index}
              initialPose={'hidden'}
              pose={this.reveal(isVisible)}
              pl={[2]}
              pr={[2]}
              mb={[2,2,'5vh']}
              {...(this.props.columns)}
            >
              <TransitionLinkComponent to={`/journal/${slug}`} title={title}>
                <Box as={`figure`} mb={[4]}>
                  <FigureBox>
                    <Img fade={false} fluid={imageMain.fluid} />
                  </FigureBox>
                </Box>
                <footer>
                  <Text as={`h3`} className={`fw-300 is-sans`} fontSize={[3,3,4]} mb={[0]}>{title}</Text>
                </footer>
              </TransitionLinkComponent>
            </Box>
          }
        </VisibilitySensor>
      )
  }
}


NewsPreview.defaultProps = {
  index: 0,
  columns: {
    width: 1/2,
    ml: [0],
    mr: [0],
  }
}

export default NewsPreview;
