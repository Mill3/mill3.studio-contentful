import React, { Component } from 'react'
import LocalizedLink from '@utils/LocalizedLink'

class ProjectsList extends Component {

  constructor(props) {
    super(props)
    this.state = {  }
    // console.log(this.props.data.edges);
  }

  list() {
    if (this.props.data) {
      return this.props.data.edges.map((project, index) =>
        <article key={index}>
          <LocalizedLink to={`/projects/${project.node.slug}`}>
            {project.node.name}
          </LocalizedLink>
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