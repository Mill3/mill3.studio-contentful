import React from 'react'
import TransitionLinkComponent from '@utils/TransitionLink'
import { Box, Text } from 'rebass'
import Img from "gatsby-image"
import styled from 'styled-components'
import posed from 'react-pose'
import SplitText from 'react-pose-text'
import VisibilitySensor from 'react-visibility-sensor'


const ProjectPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 150,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ index }) => 250 * (index + 1),
    transition: {
      opacity: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 750,
      },
      y: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 750,
      },
    }
  },
})

const ProjectPreviewItem = styled(ProjectPoses)`
  a {
    color: #000;
    text-decoration: none;
  }
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
      mt: [0, 5]
    },
    2 : {
      width: [1,1/2,1/2,1/3],
      mt: [0,0,'-20vh'],
      ml: [0,0,'7.5vw'],
    }
  }

  let column = columns.hasOwnProperty(index) ? columns[index] : columns[0]

  return column
}

const ProjectPreview = ({ index, project }) => {
  let {
    slug,
    colorMain,
    imageMain,
    name
  } = project.node

  return (
    <VisibilitySensor partialVisibility={true} offset={{top: 50, bottom: 50}}>
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
          <TransitionLinkComponent to={`/projects/${slug}`} title={name} color={colorMain}>
            <figure>
              <Img fade={false} fluid={imageMain.fluid} />
            </figure>
            <footer>
              <Text as={`h3`} className={`fw-300 is-sans`} fontSize={[3,3,4]} mb={[0]}>{name}</Text>
              <Text as={`h4`} className={`fw-300 is-serif`} fontSize={[3]}>Branding</Text>
            </footer>
          </TransitionLinkComponent>
        </Box>
      }
    </VisibilitySensor>
  );
}

export default ProjectPreview;