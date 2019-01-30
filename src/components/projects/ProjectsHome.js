import React from 'react'
import { Flex } from 'rebass'
import ProjectPreview from './ProjectPreview'

class ProjectsHome extends React.Component {

  list() {
    if (this.props.data) {
      return this.props.data.edges.map((project, index) =>
        <ProjectPreview key={index} index={index} project={project} />
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

export default ProjectsHome