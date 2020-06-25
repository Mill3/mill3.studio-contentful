import React, { useEffect, useState, useRef } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import { Box } from 'rebass'

import '@styles/flickity.css'
import Flickity from 'react-flickity-component';

//import { MediaItemVideo } from './ContentImages'
import { VERTICAL_SPACER, GRID_GUTTER } from './index'
import Container from '@styles/Container'
import { getContentType, CONTENT_TYPES } from '@utils'
import FigureBox from '@utils/FigureBox'
import Viewport from '@utils/Viewport'

const flickityOptions = {
  prevNextButtons: false,
  pageDots: false,
  dragThreshold: 10,
  selectedAttraction: 0.01,
  friction: 0.15,
  cellAlign: 'left',
  freeScroll: true,
  contain: true,
  // wrapAround: true,
  // lazyLoad: 8
}

const SliderContainer = styled.div`
  max-width: 100vw;
  overflow: hidden;
`
const SliderItemContainer = styled.figure`
  overflow: hidden;

  img {
    height: 100%;
    object-fit: contain;
    opacity: ${props => props.dragging ? 0.5 : 1};
    transform: ${props => props.dragging ? `scale(0.775)` : `scale(1)`};
    transition-delay: ${props => `${(props.index + 1) * 25}ms`};
    transition-duration: 0.425s;
    transition-timing-function: ease-in-out;
    transition-property: opacity, transform;
  }
`

export const SlideItem = ({ img, dragging, index }) => {
  return (
    <Box as={SliderItemContainer} dragging={dragging} index={index} width={['66vw', null, '35vw']} px={[2, 3, `${GRID_GUTTER}px`]}>
      <FigureBox>
        {img && img.file && getContentType(img.file.contentType) === CONTENT_TYPES['image'] && (
          <img
            src={img.fixed ? img.fixed.src : img.file.url}
            className="img-fluid"
            alt={`${img.description || img.id}`}
          />
        )}
      </FigureBox>
    </Box>
  )
}

const ContentSlides = ({ data }) => {
  const sliderRef = useRef()
  const [ dragging, setDragging ] = useState(false)

  useEffect(() => {
    const { current } = sliderRef
    if( !current ) return

    current.on('pointerDown', () => setDragging(true))
    current.on('pointerUp', () => setDragging(false))

  }, [sliderRef])

  return (
    <Box as={SliderContainer}>
      <Container fluid={true} mb={VERTICAL_SPACER}>
        <Box mx={[-2, -3, `-${GRID_GUTTER}px`]}>
          {Viewport.exists &&
            <Flickity 
              flickityRef={c => sliderRef.current = c} 
              options={flickityOptions} 
              elementType="article" 
              disableImagesLoaded={true}
            >
              {data.medias && data.medias.map((img, index) => <SlideItem img={img} index={index} dragging={dragging} key={index} />)}
            </Flickity>
          }
        </Box>
      </Container>
    </Box>
  )
}

export default ContentSlides

export const ContentImagesFragement = graphql`
  fragment ContentSlidesFragement on ContentfulContentSlides {
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
