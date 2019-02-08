import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'
import ProjectPreview from './ProjectPreview'
import TransitionLinkComponent from '@utils/TransitionLink'
import Button from '@components/buttons'

class ProjectsHome extends React.Component {

  list() {
    if (this.props.data) {
      return this.props.data.edges.map((project, index) =>
        <ProjectPreview key={index} index={index} project={project} />
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
              <Button>More project here</Button>
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