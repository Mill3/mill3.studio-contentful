import React from 'react'
import TransitionLinkComponent from '@utils/TransitionLink'
import { Box } from 'rebass'
import Img from "gatsby-image"
import styled from 'styled-components'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import VisibilitySensor from 'react-visibility-sensor'


const ProjectPoses = posed.article({
  hidden: {
    opacity: 0,
    y: ({ index }) => 150 * ((index + 1) / 5),
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: {
        type: 'tween',
        ease: 'backInOut',
        duration: 1250,
        delay: ({ index }) => (index + 1) * 150,
      },
      y: {
        type: 'tween',
        ease: 'backInOut',
        duration: 1250,
        delay: ({ index }) => (index + 1) * 150,
      },
    }
  },
})

const ProjectPreviewItem = styled(ProjectPoses)`
  /* border: 1px solid rebeccapurple; */
`

const ProjectPreview = ({ index, project }) => {
  return (
    <VisibilitySensor partialVisibility={true} offset={{top: -250, bottom: -250}}>
      {({isVisible}) =>
        <Box as={ProjectPreviewItem} index={index} initialPose={'hidden'} pose={isVisible ? 'visible' : 'hidden'} width={[1,1/2,1/2,1/2]} pl={[2]} pr={[2]}>
          <TransitionLinkComponent to={`/projects/${project.node.slug}`}>
            <figure>
              <Img fade={false} fluid={project.node.imageMain.fluid} />
            </figure>
            <h2>{project.node.name}</h2>
          </TransitionLinkComponent>
        </Box>
      }
    </VisibilitySensor>
  );
}

export default ProjectPreview;