import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Box } from 'rebass'
import { useInView } from 'react-intersection-observer'


import { getContentType, CONTENT_TYPES } from '@utils'
import { AnimatedBackgroundRowContainer, RowContainer, Grid, VERTICAL_SPACER } from './index'

// export const StickyImage = ({ src }) => {
//   return (
//     <Box as={StickyImageStyle} src={src} />
//   )
// }

export const ContentImage = ({ img, noStrech, setAsSticky, backgroundColor, index }) => {
  const [ ref, inView ] = useInView({ triggerOnce: true })

  return (
    <Flex
      ref={ref}
      as={ContentImageFlexWrapper}
      py={backgroundColor ? VERTICAL_SPACER : 0}
      backgroundColor={backgroundColor ? backgroundColor : `transparent`}
      alignItems={`center`}
      justifyContent={`center`}
    >
      <Box
        as={ContentImagePoses}
        width={noStrech ? `auto` : `100%`}
        index={index}
        initialPose={'hidden'}
        pose={inView ? 'visible' : 'hidden'}
        mb={0}
      >
        {img.file && !setAsSticky && getContentType(img.file.contentType) === CONTENT_TYPES['image'] && (
          <img
            src={img.fixed ? img.fixed.src : img.file.url}
            className={`img-fluid`}
            alt={`${img.description || img.id}`}
          />
        )}

        {img.file && setAsSticky && getContentType(img.file.contentType) === CONTENT_TYPES['image'] && (
          // <p>{img.fixed ? img.fixed.src : img.file.url}</p>
          <StickyImage imgUrl={img.fixed ? img.fixed.src : img.file.url}>
            <picture></picture>
          </StickyImage>
        )}

        {img.file && getContentType(img.file.contentType) === CONTENT_TYPES['video'] && (
          <MediaItemVideo autoPlay loop playsInline muted>
            <source src={img.file.url} type={img.file.contentType} />
          </MediaItemVideo>
        )}

        {img.file && img.description && (
          <Box as={`figcaption`} pt={[2]} pl={[3, 4]} color={'gray'}>
            {img.description}
          </Box>
        )}
      </Box>
    </Flex>
  )
}


const OverlayImage = ({ img }) => {
  const [ ref, inView ] = useInView({ triggerOnce: true })
  return <OverlayImagePoses ref={ref} src={img.file.url} initialPose={'hidden'} pose={inView ? `visible` : 'hidden'} />
}

const ContentImages = ({ data }) => {
  const Wrapper = data.fadeInBackgroundColor ? AnimatedBackgroundRowContainer : RowContainer
  let mt = VERTICAL_SPACER;

  if( data.gaplessGrid ) mt = 0;
  else if( data.backgroundColor && !data.fadeInBackgroundColor ) mt = 0;
  //else if( data.backgroundColor && data.fadeInBackgroundColor ) mt = VERTICAL_SPACER.map(x => x + 1);

  return (
    <Wrapper alignContent={data.alignContent} backgroundColor={data.backgroundColor}>
      <Box
        as={Grid}
        py={data.backgroundColor && !data.fadeInBackgroundColor ? VERTICAL_SPACER : 0}
        mt={mt}
        mb={data.noBottomMargin ? 0 : VERTICAL_SPACER}
        gaplessGrid={data.gaplessGrid}
        itemsPerRow={data.itemsPerRow}
        alignItems={data.alignVertical}
      >
        {data.medias && data.medias.map((img, index) => (
          <ContentImage img={img} noStrech={data.noStrechedImages} index={index} key={index} />
        ))}
        {data.imageItems && data.imageItems.map((imageItem, index) => (
          <ContentImage img={imageItem.media} setAsSticky={imageItem.setAsSticky} noStrech={data.noStrechedImages} backgroundColor={imageItem.backgroundColor} index={index} key={index} />
        ))}
        {/* add extra image on top */}
        {data.overlayImage && <OverlayImage img={data.overlayImage} className="-img-fluid" />}
      </Box>
    </Wrapper>
  )
}

export default ContentImages

//
// Place styled-components here (or any related logic function)
//

const ContentImageFlexWrapper = styled.div`
  width: 100%;
  height: 100%;
  line-height: 0;
`

const MediaItemVideo = styled.video`
  margin: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const StickyImage = styled.figure`
  height: 100vh;
  width: 100%;
  position: relative;
  z-index: 1;
  picture {
    background-image: url(${props => props.imgUrl});
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position: center center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
`

const ContentImagePoses = posed.figure({
  hidden: {
    opacity: 0,
    y: 150,
    margin: 0,
    width: ({ width }) => (width)
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
    zIndex: 10,
    maxWidth: `80vw`
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
    noStrechedImages
    backgroundColor
    fadeInBackgroundColor
    imageItems {
      backgroundColor
      setAsSticky
      media {
        id
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
