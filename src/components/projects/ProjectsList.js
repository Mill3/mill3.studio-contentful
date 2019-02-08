import React, { Component } from 'react'
import TransitionLinkComponent from '@utils/TransitionLink'
import { Flex, Box } from 'rebass'
import Img from "gatsby-image"
import styled from 'styled-components'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import VisibilitySensor from 'react-visibility-sensor'

const ProjectPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ index }) => (index + 1) * 150,
    transition: {
      y: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 2500,
      },
    }
  },
})

const ProjectBox = styled(ProjectPoses)`
  /* border: 1px solid rebeccapurple; */
`

class ProjectsList extends Component {

  constructor(props) {
    super(props)
    this.state = {  }
  }

  list() {
    if (this.props.data) {
      return this.props.data.edges.map((project, index) =>
        <VisibilitySensor partialVisibility={true} offset={{top:50, bottom: 50}}>
          {({isVisible}) =>
            <Box as={ProjectBox} index={index} pose={isVisible ? 'visible' : 'hidden'} width={[1,1/2,1/2,1/2]} pl={[2]} pr={[2]} key={index}>
              <TransitionLinkComponent to={`/projects/${project.node.slug}`}>
                <figure>
                  <Img fade={false} fluid={project.node.imageMain.fluid} />
                </figure>
                <h2>{project.node.name}</h2>
              </TransitionLinkComponent>
            </Box>
          }
        </VisibilitySensor>
      )
    }
  }

  render() {
    return (
      <Flex as={`section`} flexWrap={`wrap`}>
        {this.list()}
        {this.list()}
      </Flex>
    );
  }
}

export default ProjectsList