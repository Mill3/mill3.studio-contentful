import React, { Component } from 'react'

import { getContentfulEntryID } from '@utils/ContentfulClient'

import ProjectSingle from '@components/projects/ProjectSingle'
import NewsSingle from '@components/news/NewsSingle'

class Preview extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: null,
    }
    this.interval = null
    this.update = this.update.bind(this)
    this.entryID = getContentfulEntryID()
  }

  update() {
    console.log(`this should fetch for new data`)
    fetch(`${process.env.PREVIEW_URL_PROJECTS}?entry=${this.entryID}&locale=${this.props.pageContext.locale}`)
      .then(response => response.json())
      .then(node => {
        this.setState({
          data: node.data,
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

  component(data) {
    const pageContext = {
      locale: this.props.pageContext.locale,
    }
    const { model } = this.state.data

    // pick content Single component
    switch (model) {
      case 'project':
        return <ProjectSingle pageContext={pageContext} data={{ project: this.state.data }} />
        break
      case 'news':
        return <NewsSingle pageContext={pageContext} data={{ news: this.state.data }} />
        break
      default:
        return <ProjectSingle pageContext={pageContext} data={{ project: this.state.data }} />
        break
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.data ? this.component() : ''}
      </React.Fragment>
    )
  }
}

export default Preview
