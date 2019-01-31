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
    y: 350,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: {
        type: 'tween',
        ease: 'easeOut',
        duration: 3500,
        delay: ({ index }) => 350 * (index + 1),
      },
      y: {
        type: 'tween',
        ease: 'easeOut',
        duration: 3500,
        delay: ({ index }) => 350 * (index + 1),
      },
    }
  },
})

const ProjectPreviewItem = styled(ProjectPoses)`
  /* border: 1px solid rebeccapurple; */
`

const ProjectPreviewCol = (index) => {

  const columns = {
    0 : {
      width: [1,1/2,1/3,1/3],
      mr: [0, 'auto'],
    },
    1 : {
      width: [1,1/2,1/2,1/2],
      ml: [0, 'auto'],
    },
    2 : {
      width: [1,1/2,1/2,1/2],
      ml: [0, 'auto'],
      mr: [0, 'auto'],
    }
  }


  let column = columns.hasOwnProperty(index) ? columns[index] : columns[0]
  console.log(column);

  return column

}

const ProjectPreview = ({ index, project }) => {
  return (
    <VisibilitySensor partialVisibility={true} offset={{top: -350, bottom: -350}}>
      {({isVisible}) =>
        <Box
          as={ProjectPreviewItem}
          index={index}
          initialPose={'hidden'}
          pose={isVisible ? 'visible' : 'hidden'}
          pl={[2]}
          pr={[2]}
          mb={[2,2,'5vh']}
          {...(ProjectPreviewCol(index))}
        >
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