import React from 'react'
import { Flex, Box, Text } from 'rebass'
import ProjectPreview from './ProjectPreview'
import TransitionLinkComponent from '@utils/TransitionLink'
import Button from '@components/buttons'

export const columns = {
  0 : {
    width: [1,1/2,1/3,1/3],
    mr: [0, 'auto'],
  },
  1 : {
    width: [1,1/2,1/2,1/2],
    ml: [0, 'auto'],
    mt: [0, 5]
  },
  2 : {
    width: [1,1/2,1/2,1/3],
    mt: [0,0,'-30vh'],
    ml: [0,0,'7.5vw'],
  }
}

export const ProjectHomeCol = (index) => {
  let column = columns.hasOwnProperty(index) ? columns[index] : columns[0]
  return column
}


class ProjectsHome extends React.Component {

  list() {
    if (this.props.data) {
      return this.props.data.edges.map((project, index) =>
        <ProjectPreview key={index} index={index} project={project} columns={ProjectHomeCol(index)} offset={index % 2 ? -0.1 : 0} />
      )
    }
  }

  render() {
    return (
      <>
        <Flex mb={[5]} flexWrap={`wrap`}>
          {this.list()}
        </Flex>
        <Flex mb={[5]} justifyContent={`center`} flexDirection={`column`}>
          <Box width={[`auto`]} m={`auto`}>
            <TransitionLinkComponent to={`/projects`}>
              <Button>Hey, there’s more work here !</Button>
            </TransitionLinkComponent>
          </Box>
          <Box width={[1,3/4]} pt={[5]} pb={[5]} m={`auto`}>
            <Text fontSize={[2,3,3,`2vw`]} textAlign={`center`} className={`fw-300`}>
              We work for the growth and the influence of brands from here and elsewhere in developing tools and customized campaigns. Here’s to name a few.
            </Text>
          </Box>
        </Flex>
      </>
    );
  }
}

export default ProjectsHome
