import React, { Component } from 'react'


import { getContentfulEntryID } from "@utils/ContentfulClient"

import ProjectSingle from "@components/projects/ProjectSingle"

class Preview extends Component {

  // static entryID = new URL(window.location.href).searchParams.get('entry')

  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
    this.entryID = getContentfulEntryID()
    this.update = this.update.bind(this)
    console.log('this.entryID:', this.entryID)
    // console.log('entryID:', new URL(window.location.href).searchParams.get('entry'))
  }

  update() {
    console.log(`this should fetch for new data`);
    fetch(`${process.env.PREVIEW_URL_PROJECTS}?entry=${this.entryID}&locale=${this.props.pageContext.locale}`)
      .then(response => response.json())
      .then(node => {
        this.setState({
          data: {
            project: node.data
          }
        })
      })
  }

  componentDidMount() {
    this.update()
    // start an interval refreshing data every 5 sec.
    setInterval(() => {
      this.update()
    }, 5000)
  }

  render() {

    const pageContext = {
      locale: this.props.pageContext.locale
    }

    return (
      <div>
        {/* for previewing.. */}
        {this.state.data &&
          <ProjectSingle pageContext={pageContext} data={this.state.data} />
        }
      </div>
    );
  }
}

export default Preview;