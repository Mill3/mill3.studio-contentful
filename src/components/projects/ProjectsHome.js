import React from 'react'
import { Flex } from 'rebass'

import { LayoutContext } from "@layouts/layoutContext"
import ProjectPreview from './ProjectPreview'
import { ProjectIndexList } from './ProjectsIndex'
import Container from '@styles/Container'
import { breakpoints } from '@styles/Theme'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'
import { TRANSITION_PANE_STATES, INTRO_REVEALS_DELAY, TRANSITION_IN_DELAY } from '@utils/constants'

export const columns = {
  0: {
    width: [1, 1 / 2, 1 / 2, 4.5 / 12, 1 / 3],
  },
  1: {
    width: [1, 1 / 2],
    ml: ['auto'],
    mt: [0, 5],
  },
  2: {
    width: [1, 1 / 2, 1 / 2, 4.5 / 12, 1 / 3],
    mt: [0, 0, -5, '-30vh'],
    ml: [0, 0, 0, `${((6 - 4.5) / 12) * 100}%`],
  },
  3: {
    width: [1, 1 / 2, 1 / 2, 4.5 / 12, 1 / 3],
    mt: [null, null, null, null, 40],
    ml: [null, null, null, 'auto'],
  },
  4: {
    width: [1, 1 / 2, 1 / 2, 5.5 / 12, 1 / 2],
    mt: [0, 0, -5, '-30vh'],
  },
  5: {
    width: [1, 1 / 2, 1 / 2, 4.5 / 12, 1 / 3],
    mt: [null, null, null, null, 70],
    ml: [null, null, null, `${(1 / 12) * 100}%`, `${(0.25 / 12) * 100}%`],
  },
}

export const ProjectHomeCol = index => {
  let column = columns.hasOwnProperty(index) ? columns[index] : columns[0]
  return column
}

const mobileBreakpoint = parseInt(breakpoints[1])

class ProjectsHome extends React.Component {

  list() {

    if (this.props.data) {
      const { layoutState } = this.context
      const isMobile = Viewport.width < mobileBreakpoint
      const getOffset = index => {
        if (isMobile) return 0

        return new ResponsiveProp([
          null,
          null,
          [0, 90][index % 2],
          [0, 120, -30, 140, -55, 160][index],
          [0, 140, -60, 200, 60, 240][index],
        ])
      }
      const getDelay = index => {
        const delayBase = layoutState.transition.state === TRANSITION_PANE_STATES['intro'] ? INTRO_REVEALS_DELAY : TRANSITION_IN_DELAY

        if (isMobile) return index === 0 ? delayBase * 1.25 : 0
        else return index < 2 ? (delayBase * 1.25) + index * 150 : 0
      }

      return this.props.data.edges.map((project, index) => {
        const offset = getOffset(index)
        const delay = getDelay(index)

        return (
          <ProjectPreview
            key={index}
            index={index}
            delay={delay}
            project={project}
            columns={ProjectHomeCol(index)}
            offset={offset}
          />
        )
      })
    }
  }

  render() {
    return (
      <Container fluid pb={[0, null, null, 6, 7]}>
        <Flex
          as={ProjectIndexList}
          mb={'90px'}
          mx={['-6.35vw', null, -3, '-28px']}
          flexWrap={`wrap`}
          alignItems={`start`}
        >
          {this.list()}
        </Flex>
      </Container>
    )
  }
}

ProjectsHome.contextType = LayoutContext;

export default ProjectsHome
