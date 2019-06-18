import React from 'react'
import { Flex, Box, Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'

import ProjectPreview from './ProjectPreview'
import Button from '@components/buttons'
import { breakpoints } from '@styles/Theme'
import { TRANSITION_DURATION } from '@utils/constants'
import Viewport from '@utils/Viewport'
import TransitionLinkComponent from '@utils/TransitionLink'

export const columns = {
  0 : {
    width: [1, 1/2, 1/2, 4.5/12, 1/3],
  },
  1 : {
    width: [1, 1/2],
    ml: ['auto'],
    mt: [0, 5],
  },
  2 : {
    width: [1, 1/2, 1/2, 4.5/12, 1/3],
    mt: [0, 0, -5, '-30vh'],
    ml: [0, 0, 0, `${((6 - 4.5) / 12)*100}%`]
  },
}

export const ProjectHomeCol = (index) => {
  let column = columns.hasOwnProperty(index) ? columns[index] : columns[0]
  return column
}

const mobileBreakpoint = parseInt(breakpoints[1])

class ProjectsHome extends React.Component {

  list() {
    if (this.props.data) {
      const isMobile = Viewport.width < mobileBreakpoint
      const getDelay = (index) => {
        if( isMobile ) return index === 0 ? TRANSITION_DURATION * 3 : 0
        else return index < 2 ? TRANSITION_DURATION * 2 + index * 250 : 0
      }

      return this.props.data.edges.map((project, index) => {
        const offset = isMobile ? 0 : ( index % 2 ? 120 : 0 )
        const delay = getDelay(index)

        return (
          <ProjectPreview
            key={index}
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
        <Flex mb={['90px', null, '80px']} mx={['-5vw', null, -3, -4]} flexWrap={`wrap`}>
          {this.list()}
        </Flex>
        <Flex mb={[5]} mx={['-5vw', null, -3, -4]} justifyContent={`center`} flexDirection={`column`}>
          <Box width={[`auto`]} m={`auto`}>
            <TransitionLinkComponent to={`/projects`}>
              <Button>
                {intl.formatMessage({id: 'projects.Button' })}
              </Button>
            </TransitionLinkComponent>
          </Box>
          <Box width={[10/12, 3/4]} pt={['80px', null, '110px']} pb={[0, null, 5]} m={`auto`}>
            <Text fontSize={['5.314009662vw', null, 3, `2vw`]} textAlign={`center`} className={`fw-300`}>
              <FormattedMessage id="projects.HomeOutro" />
            </Text>
          </Box>
        </Flex>
      </>
    );
  }
}

export default injectIntl(ProjectsHome)
