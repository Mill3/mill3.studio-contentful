import React, { Component } from 'react'


import ProjectSingle from "@components/projects/ProjectSingle"

class Preview extends Component {

  static entryID = new URL(window.location.href).searchParams.get('entry')


  constructor(props) {
    super(props);
    this.state = {  }
    // console.log('entryID:', new URL(window.location.href).searchParams.get('entry'))
  }
  render() {

    const pageContext = {
      locale: 'en'
    }

    return (
      <div>
        for previewing..
        {/* <ProjectSingle pageContext={pageContext} /> */}
      </div>
    );
  }
}

export default Preview;