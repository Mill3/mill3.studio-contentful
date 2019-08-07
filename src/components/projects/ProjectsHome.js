import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'

import ProjectPreview from './ProjectPreview'
import { ProjectIndexList } from './ProjectsIndex'
import Button from '@components/buttons'
import { breakpoints } from '@styles/Theme'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'
import { TRANSITION_INTRO_DELAY, TRANSITION_IN_DELAY, TRANSITION_DURATION } from '@utils/constants'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import { TRANSITION_PANE_STATES } from '@components/transitions'

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

  static contextTypes = {
    layoutState: PropTypes.object,
  }

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
        const delayBase = layoutState.transitionState === TRANSITION_PANE_STATES['intro'] ? TRANSITION_INTRO_DELAY : TRANSITION_IN_DELAY

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
    const { intl } = this.props
    return (
      <>
        <Flex
          as={ProjectIndexList}
          mb={['90px', null, '140px', '180px', '270px']}
          mx={['-6.25vw', null, -3, '-28px']}
          flexWrap={`wrap`}
          alignItems={`start`}
        >
          {this.list()}
        </Flex>
        <Flex mb={[5]} mx={['-6.15vw', null, -3, '-28px']} justifyContent={`center`} flexDirection={`column`}>
          <Box width={[`auto`]} m={`auto`}>
            <TransitionLinkComponent to={`/projects`}>
              <Button>{intl.formatMessage({ id: 'projects.Button' })}</Button>
            </TransitionLinkComponent>
          </Box>
          <Box width={[10 / 12, 3 / 4]} pt={['80px', null, '110px']} pb={[0, null, 5]} m={`auto`}>
            <Text fontSize={['5.314009662vw', null, 3, `2vw`]} textAlign={`center`} className={`fw-300`}>
              <FormattedMessage id="projects.HomeOutro" />
            </Text>
          </Box>
        </Flex>
      </>
    )
  }
}

export default injectIntl(ProjectsHome)
