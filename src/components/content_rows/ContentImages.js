import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Box } from 'rebass'
import { useInView } from 'react-intersection-observer'

import { EASES, REVEALS_DELAY } from '@utils/constants'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { getContentType, CONTENT_TYPES } from '@utils'
import { AnimatedBackgroundRowContainer, RowContainer, Grid, VERTICAL_SPACER } from './index'
import { postBody, format, TextColumn } from './ContentText'

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

const ContentImagePoses = posed.figure({
  hidden: {
    opacity: 0,
    y: 150,
    margin: 0,
    width: ({ width }) => width,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ index, isFirst }) =>REVEALS_DELAY * (index + 1),
    transition: EASES['default'],
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
    maxWidth: `80vw`,
  },
  visible: {
    opacity: 1,
    y: `-50%`,
    transition: EASES['default'],
  },
})

export const ContentImage = ({ img, noStrech, backgroundColor, index, isFirst }) => {
  // console.log('noVerticalMargin:', noVerticalMargin)
  const [ref, inView] = useInView({ triggerOnce: true })

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
          isFirst={isFirst}
          initialPose={'hidden'}
          pose={inView ? 'visible' : 'hidden'}
          mb={0}
        >
          <TransitionContainer direction="out" enabled={inView} autoCalculateDelay={false} distance={50} index={index}>

            {img.file && getContentType(img.file.contentType) === CONTENT_TYPES['image'] && (
              <img
                src={img.fixed ? img.fixed.src : img.file.url}
                className={`img-fluid`}
                alt={`${img.description || img.id}`}
              />
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

          </TransitionContainer>

        </Box>
    </Flex>
  )
}

const OverlayImage = ({ img }) => {
  const [ref, inView] = useInView({ triggerOnce: true })
  return <OverlayImagePoses ref={ref} src={img.file.url} initialPose={'hidden'} pose={inView ? `visible` : 'hidden'} />
}

const ContentImages = ({ data, isFirst }) => {
  const Wrapper = data.fadeInBackgroundColor ? AnimatedBackgroundRowContainer : RowContainer

  return (
    <Wrapper alignContent={data.alignContent} backgroundColor={data.backgroundColor}>
      <Box
        as={Grid}
        py={data.backgroundColor && !data.fadeInBackgroundColor && !data.noBottomMargin ? VERTICAL_SPACER : 0}
        my={
          // TODO: fix me, ugly condition
          data.noBottomMargin || data.gaplessGrid || (data.backgroundColor && !data.fadeInBackgroundColor)
            ? [0]
            : VERTICAL_SPACER
        }
        gaplessGrid={data.gaplessGrid}
        itemsPerRow={data.itemsPerRow}
        alignItems={data.alignVertical}
      >
        {data.medias &&
          data.medias.map((img, index) => (
            <ContentImage img={img} noStrech={data.noStrechedImages} index={index} key={index} isFirst={isFirst} />
          ))}
        {data.imageItems &&
          data.imageItems.map((imageItem, index) => (
            <Flex alignItems={data.alignVertical} flexWrap={'wrap'}>
              <Box width={imageItem.sideText ? [1, 1, 1, 1 / 2] : [1]} order={imageItem.invertOrder ? 1 : 0}>
                <ContentImage
                  img={imageItem.media}
                  setAsSticky={imageItem.setAsSticky}
                  noStrech={data.noStrechedImages}
                  backgroundColor={imageItem.backgroundColor}
                  index={index}
                  key={index}
                  isFirst={isFirst}
                />
              </Box>
              {imageItem.sideText && (
                <Box as={postBody} px={[2, 3, 4, 5, 6]} width={[1, 1, 1, 1 / 2]} order={imageItem.invertOrder ? 0 : 1}>
                  <TextColumn
                    text={imageItem.sideText ? format(imageItem.sideText.sideText || imageItem.sideText.content) : []}
                    index={0}
                    margin={[0]}
                    isFirst={isFirst}
                  />
                </Box>
              )}
            </Flex>
          ))}
        {/* add extra image on top */}
        {data.overlayImage && <OverlayImage img={data.overlayImage} />}
      </Box>
    </Wrapper>
  )
}

export default ContentImages

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
      sideText {
        sideText
      }
      invertOrder
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
