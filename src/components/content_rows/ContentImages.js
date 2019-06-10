import React, { useState } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import posed from 'react-pose'
import { Box } from 'rebass'
import VisibilitySensor from 'react-visibility-sensor'

import { getContentType, CONTENT_TYPES } from '@utils'
import {
  RowContainer,
  VERTICAL_SPACER,
  VERTICAL_ALIGN_VALUES,
  GRID_GUTTER,
} from './index'

const ContentImage = ({ img, index }) => {
  const [visible, setVisible] = useState(false)

  return (
    <VisibilitySensor
      // this lock the visibily effect once its set to true
      // default is false, set value event, then always set to true
      onChange={e => setVisible(!visible ? e : true)}
      partialVisibility={true}
      offset={{ top: -50 }}
    >
      {({ isVisible }) => (
        <Box
          as={ContentImagePoses}
          index={index}
          initialPose={'hidden'}
          pose={visible ? 'visible' : 'hidden'}
          m="0"
        >
          {getContentType(img.file.contentType) === CONTENT_TYPES['image'] && (
            <img
              src={img.fluid ? img.fluid.src : img.file.url}
              srcSet={img.fluid ? img.fluid.srcSet : null}
              className="img-fluid"
              alt={`${img.description || img.id}`}
            />
          )}

          {getContentType(img.file.contentType) === CONTENT_TYPES['video'] && (
            <MediaItemVideo autoPlay loop playsInline muted>
              <source src={img.file.url} type={img.file.contentType} />
            </MediaItemVideo>
          )}

          {img.description && (
            <Box as={`figcaption`} pt={[2]} pl={[3, 4]} color={'gray'}>
              {img.description}
            </Box>
          )}
        </Box>
      )}
    </VisibilitySensor>
  )
}

const OverlayImage = ({ img }) => {
  const [visible, setVisible] = useState(false)

  return (
    <VisibilitySensor
      // this lock the visibily effect once its set to true
      // default is false, set value event, then always set to true
      onChange={e => setVisible(!visible ? e : true)}
      partialVisibility={true}
      offset={{ top: -500 }}
    >
      {({ isVisible }) => (
        <OverlayImagePoses
          src={img.file.url}
          initialPose={'hidden'}
          pose={isVisible ? `visible` : 'hidden'}
        />
      )}
    </VisibilitySensor>
  )
}

const ContentImages = ({ data }) => {
  return (
    <RowContainer
      alignContent={data.alignContent}
      backgroundColor={data.backgroundColor}
    >
      <Box
        as={Grid}
        py={data.backgroundColor ? VERTICAL_SPACER : 0}
        mt={data.gaplessGrid ? 0 : VERTICAL_SPACER}
        mb={data.noBottomMargin ? 0 : VERTICAL_SPACER}
        gaplessGrid={data.gaplessGrid}
        itemsPerRow={data.itemsPerRow}
        alignItems={data.alignVertical}
      >
        {data.medias.map((img, index) => (
          <ContentImage img={img} index={index} key={img.id} />
        ))}
        {data.overlayImage && <OverlayImage img={data.overlayImage} />}
      </Box>
    </RowContainer>
  )
}

export default ContentImages

//
// Plaece styled-components here (or any related logic function)
//

const GridColums = itemsPerRow => {
  // since we join the produced array with a string value,
  // we must add an extra cell to the array producing 1 more grid-column.
  // ie: 4 rows need +1. [empty, empty, empty, empty, empty] joined in a string as "1fr 1fr 1fr fr"
  const rows = parseInt(itemsPerRow) + 1
  return new Array(rows).map((item, index) => index).join('1fr ')
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: ${props => (props.gaplessGrid ? `0px` : `${GRID_GUTTER}px`)};
  align-items: ${props =>
    props.alignItems ? VERTICAL_ALIGN_VALUES[props.alignItems] : `flex-start`};
  position: relative;

  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    grid-template-columns: ${props => GridColums(props.itemsPerRow)};
  }
`

const MediaItemVideo = styled.video`
  margin: 0;
  width: 100%;
  object-fit: cover;
`

const ContentImagePoses = posed.figure({
  hidden: {
    opacity: 0,
    y: 150,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ index }) => 250 + index * 125,
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    },
  },
})

const OverlayImagePoses = posed.img({
  hidden: {
    opacity: 0,
    position: 'absolute',
    top: `50%`,
    left: `50%`,
    y: `0%`,
    x: `-50%`,
  },
  visible: {
    opacity: 1,
    y: `-50%`,
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    },
  },
})

export const ContentImagesFragement = graphql`
  fragment ContentImagesFragement on ContentfulContentImages {
    itemsPerRow
    alignContent
    alignVertical
    gaplessGrid
    noBottomMargin
    backgroundColor
    overlayImage {
      file {
        url
        contentType
      }
    }
    medias {
      id
      description
      file {
        url
        contentType
      }
      fixed(width: 1800, quality: 85) {
        ...GatsbyContentfulFixed_noBase64
      }
      fluid(maxWidth: 1800, quality: 85) {
        ...GatsbyContentfulFluid_withWebp_noBase64
      }
    }
  }
`
