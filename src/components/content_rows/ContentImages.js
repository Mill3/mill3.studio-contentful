import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Box } from 'rebass'
import { useInView } from 'react-intersection-observer'

import { getContentType, CONTENT_TYPES } from '@utils'
import { EASES, REVEALS_DELAY } from '@utils/constants'
import Viewport from '@utils/Viewport'
import VideoElement from '@components/player/VideoElement'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { breakpoints } from '@styles/Theme'

import { AnimatedBackgroundRowContainer, RowContainer, GridContentImages, VERTICAL_SPACER, BOTTOM_SPACER } from './index'
import { postBody, format, TextColumn } from './ContentText'

const ContentImageFlexWrapper = styled.div`
  width: 100%;
  height: 100%;
  line-height: 0;
  box-shadow: ${props => (props.dropshadow === true ? `5px 15px 25px rgba(0,0,0,0.5)` : `none`)};
`

const ContentImagePoses = posed.figure({
  hidden: {
    opacity: 0,
    y: 150,
    margin: 0,
    'box-shadow': ({ dropshadow }) => (dropshadow ? `0px 0px 0px rgba(0,0,0,0)` : `none`),
    width: ({ width }) => width,
  },
  visible: {
    opacity: 1,
    y: 0,
    'box-shadow': ({ dropshadow }) => (dropshadow ? `0px 24px 40px rgba(0,0,0,0.08)` : `none`),
    delay: ({ delay }) => delay,
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

export const ContentImage = ({ img, noStrech, backgroundColor, alignItems, dropshadow, index, delay = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <Flex
      ref={ref}
      as={ContentImageFlexWrapper}
      py={backgroundColor ? VERTICAL_SPACER : 0}
      backgroundColor={backgroundColor ? backgroundColor : `transparent`}
      alignItems={alignItems ? alignItems : 'center'}
      justifyContent={`center`}
    >
      <Box
        as={ContentImagePoses}
        width={noStrech ? `auto` : `100%`}
        index={index}
        initialPose={'hidden'}
        pose={inView ? 'visible' : 'hidden'}
        delay={delay}
        dropshadow={dropshadow}
        mb={0}
      >
        <TransitionContainer direction="out" enabled={inView} autoCalculateDelay={false} distance={50} index={index}>
          {img.file && getContentType(img.file.contentType) === CONTENT_TYPES['image'] && (
            <img src={img.fixed ? img.fixed.src : img.file.url} className={`img-fluid`} alt={`${img.description || img.id}`} />
          )}

          {img.file && getContentType(img.file.contentType) === CONTENT_TYPES['video'] && <VideoElement asset={img} />}

          {/* {img.file && img.description && (
            <Box as={`figcaption`} pt={[2]} pl={[3, 4]} color={'gray'}>
              {img.description}
            </Box>
          )} */}
        </TransitionContainer>
      </Box>
    </Flex>
  )
}

const OverlayImage = ({ img }) => {
  const [ref, inView] = useInView({ triggerOnce: true })
  return <OverlayImagePoses ref={ref} src={img.file.url} initialPose={'hidden'} pose={inView ? `visible` : 'hidden'} />
}

const SMALL_SCREENS_BREAKPOINT = parseInt(breakpoints[1])

const ContentImages = ({ data, isFirst, isLast }) => {
  const {
    medias,
    imageItems,
    overlayImage,
    noBottomMargin,
    backgroundColor,
    itemsPerRow,
    itemsPerRowMobile,
    alignContent,
    alignVertical,
    noStrechedImages,
    dropShadowOnImages,
    fadeInBackgroundColor
  } = data

  const Wrapper = fadeInBackgroundColor ? AnimatedBackgroundRowContainer : RowContainer
  const isMobile = !(Viewport.width >= SMALL_SCREENS_BREAKPOINT)

  const CalculatePaddingTop = () => {
    return noBottomMargin ? [0] : isFirst && !backgroundColor ? [0] : VERTICAL_SPACER
  }

  const CalculatePaddingBottom = () => {
    return noBottomMargin ? [0] : (isFirst || isLast) && !backgroundColor ? BOTTOM_SPACER : VERTICAL_SPACER
  }

  const CalculateDelay = index => {
    const rows = parseInt(isMobile ? itemsPerRowMobile : itemsPerRow) || 1
    const row = (index / rows) >> 0
    const column = (index % rows) + 1

    return REVEALS_DELAY * column + row * REVEALS_DELAY * 0.25
  }

  return (
    <Wrapper alignContent={alignContent} backgroundColor={backgroundColor || null}>
      <Box
        as={GridContentImages}
        py={CalculatePaddingTop()}
        pb={CalculatePaddingBottom()}
        gaplessGrid={data.gaplessGrid}
        itemsPerRow={itemsPerRow}
        itemsPerRowMobile={itemsPerRowMobile}
        overflow={backgroundColor ? 'hidden' : 'visible' }
      >
        {/* all medias */}
        {medias &&
          medias.map((img, index) => (
            <ContentImage
              img={img}
              noStrech={noStrechedImages}
              dropshadow={dropShadowOnImages}
              alignItems={alignVertical}
              index={index}
              delay={CalculateDelay(index)}
              key={index}
            />
          ))}
        {/* all image items */}
        {imageItems &&
          imageItems.map((imageItem, index) => (
            <Flex key={index} alignItems={alignVertical} flexWrap={'wrap'}>
              <Box width={imageItem.sideText ? [1, 1, 1, 1 / 2] : [1]} order={imageItem.invertOrder ? 1 : 0}>
                <ContentImage
                  img={imageItem.media}
                  setAsSticky={imageItem.setAsSticky}
                  noStrech={noStrechedImages}
                  backgroundColor={imageItem.backgroundColor}
                  dropshadow={dropShadowOnImages}
                  alignItems={alignVertical}
                  delay={CalculateDelay(index)}
                  index={index}
                  key={index}
                />
              </Box>
              {imageItem.sideText && (
                <Box as={postBody} py={[`24px`]} px={[`24px`, 4, 4, 5, 6]} width={[1, 1, 1, 1 / 2]} order={imageItem.invertOrder ? 0 : 1}>
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
        {overlayImage && <OverlayImage img={overlayImage} />}
      </Box>
    </Wrapper>
  )
}

export default ContentImages

export const ContentImagesFragement = graphql`
  fragment ContentImagesFragement on ContentfulContentImages {
    itemsPerRow
    itemsPerRowMobile
    alignContent
    alignVertical
    gaplessGrid
    noBottomMargin
    noStrechedImages
    backgroundColor
    fadeInBackgroundColor
    dropShadowOnImages
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
