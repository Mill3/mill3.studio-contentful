import React, { Component } from 'react'
import TransitionLinkComponent from '@utils/TransitionLink'

class ProjectsList extends Component {

  constructor(props) {
    super(props)
    this.state = {  }
  }

  list() {
    if (this.props.data) {
      return this.props.data.edges.map((project, index) =>
        <article key={index}>
          <TransitionLinkComponent to={`/projects/${project.node.slug}`}>
            <h2>{project.node.name}</h2>
          </TransitionLinkComponent>
        </article>
      )
    }
  }

  render() {
    return (
      <section>
        {this.list()}
      </section>
    );
  }
}

export default ProjectsList