import React, { Component } from 'react'


import ProjectSingle from "@components/projects/ProjectSingle"

class Preview extends Component {

  // static entryID = new URL(window.location.href).searchParams.get('entry')

  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
    // console.log('entryID:', new URL(window.location.href).searchParams.get('entry'))
  }

  componentDidMount() {
    fetch(`http://localhost:9000/.netlify/functions/preview?entry=6kSnk5ay5YfyH6sSarl6ep`)
      .then((data) => {
        console.log('data:', data)
      })
  }

  render() {

    const pageContext = {
      locale: 'en'
    }

    return (
      <div>
        for previewing..
        {this.state.data &&
          <ProjectSingle pageContext={pageContext} project={this.state.data} />
        }
      </div>
    );
  }
}

export default Preview;