import React from 'react'
import TransitionLinkComponent from '@utils/TransitionLink'
import { Box, Text } from 'rebass'
import Img from "gatsby-image"
import styled from 'styled-components'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import VisibilitySensor from 'react-visibility-sensor'

const ProjectPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 150,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ index }) => (index % 1) ? 150 : 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    }
  },
})

const ProjectHoverPane = styled.span`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: ${props => props.color};
  opacity: 0.65;
  transition: transform 0.25s ease-in-out;
`

const ProjectPreviewItem = styled(ProjectPoses)`

  figure {
    position: relative;
    overflow: hidden;
    background: ${props => props.color};
    .gatsby-image-wrapper {
      display: block;
      transition: transform 5s ease-in-out;
    }
  }

  a {
    color: #000;
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }

  /* over pane on top */
  ${ProjectHoverPane} {
    transform: translateY(100%);
  }

  /* hover state */
  &:hover {
    figure {
      .gatsby-image-wrapper {
        transform: scale(1.05);
      }
    }
    ${ProjectHoverPane} {
      transform: translateY(0%);
    }
  }
`

class ProjectPreview extends React.Component {

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
        colorMain,
        imageMain,
        name
      } = this.props.project.node

      return (
        <VisibilitySensor onChange={this.onChange} partialVisibility={true} offset={{top: 50, bottom: 50}}>
          {({isVisible}) =>
            <Box
              as={ProjectPreviewItem}
              index={this.props.index}
              initialPose={'hidden'}
              pose={this.reveal(isVisible)}
              pl={[2]}
              pr={[2]}
              mb={[2,2,'5vh']}
              {...(this.props.columns)}
              color={colorMain}
            >
              <TransitionLinkComponent to={`/projects/${slug}`} title={name} color={colorMain}>
                <Box as={`figure`} mb={[4]}>
                  <ProjectHoverPane color={colorMain} />
                  <Img fade={false} fluid={imageMain.fluid} />
                </Box>
                <footer>
                  <Text as={`h3`} className={`fw-300 is-sans`} fontSize={[3,3,4]} mb={[0]}>{name}</Text>
                  <Text as={`h4`} className={`fw-300 is-serif is-gray`} fontSize={[3]}>Branding</Text>
                </footer>
              </TransitionLinkComponent>
            </Box>
          }
        </VisibilitySensor>
      )
  }
}


ProjectPreview.defaultProps = {
  index: 0,
  columns: {
    width: 1/2,
    ml: [0],
    mr: [0],
  }
}

export default ProjectPreview;