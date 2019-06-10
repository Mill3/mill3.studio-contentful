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
    this.interval = null
    this.update = this.update.bind(this)
    this.entryID = getContentfulEntryID()
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
    this.interval = setInterval(() => {
      this.update()
    }, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
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