import React, { Component } from 'react'
// import Visibility from 'visibilityjs'
import { getContentfulEntryID } from '@utils/ContentfulClient'

import ProjectSingle from '@components/projects/ProjectSingle'
import NewsSingle from '@components/news/NewsSingle'
import PageSingle from '@components/pages/PageSingle'

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
    console.time(`fetchNewData`)
    fetch(`${process.env.PREVIEW_URL_PROJECTS}?entry=${this.entryID}&locale=${this.props.pageContext.locale}`)
      .then(response => response.json())
      .then(node => {
        console.warn('Fetched new data')
        console.timeEnd(`fetchNewData`)
        this.setState({
          data: node.data,
        })
      })
  }

  componentDidMount() {
    // initial update
    this.update()

    if (typeof window === `object`) {
      const Visibility = require('visibilityjs')
      // start an interval refreshing data every 5 sec
      // only when docuement is visible
      Visibility.every(5000, () => {
        this.update()
      })

      Visibility.change((e, state) => {
        Visibility.hidden() ? console.warn(`Document is hidden`) : console.log(`Doc is visible`)
      })
    }


  }

  componentWillUnmount() {
    // clearInterval(this.interval)
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
      case 'news':
        return <NewsSingle pageContext={pageContext} data={{ news: this.state.data }} />
      case 'pages':
        return <PageSingle pageContext={pageContext} data={{ page: this.state.data }} />
      default:
        return <ProjectSingle pageContext={pageContext} data={{ project: this.state.data }} />
    }
  }

  render() {
    return <React.Fragment>{this.state.data ? this.component() : ''}</React.Fragment>
  }
}

export default Preview
