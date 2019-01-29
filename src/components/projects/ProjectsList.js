import React, { Component } from 'react'
import TransitionLinkComponent from '@utils/TransitionLink'
import { Flex, Box } from 'rebass'
import Img from "gatsby-image"


class ProjectsList extends Component {

  constructor(props) {
    super(props)
    this.state = {  }
    // console.log(this.props.data);
  }

  list() {
    if (this.props.data) {
      return this.props.data.edges.map((project, index) =>
        <Box width={[1,1/2,1/2,1/2]} pl={[2]} pr={[2]} key={index}>
          <TransitionLinkComponent to={`/projects/${project.node.slug}`}>
            <figure>
              <Img fluid={project.node.imageMain.fluid} />
            </figure>
            <h2>{project.node.name}</h2>
          </TransitionLinkComponent>
        </Box>
      )
    }
  }

  render() {
    return (
      <Flex as={`section`} flexWrap={`wrap`}>
        {this.list()}
      </Flex>
    );
  }
}

export default ProjectsList