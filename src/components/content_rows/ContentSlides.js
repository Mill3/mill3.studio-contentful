import React, { Component } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import posed from 'react-pose'
import { Flex, Box } from 'rebass'
import VisibilitySensor from 'react-visibility-sensor'

import '@styles/flickity.css'

import { MediaItemVideo } from './ContentImages'
import { getContentType, CONTENT_TYPES } from '@utils'
import { RowContainer, ALIGN_VALUES, VERTICAL_SPACER, GRID_GUTTER } from './index'

const Flickity = typeof window === `object` ? require('react-flickity-component') : null
// if (typeof window === `object`) {
// }

const flickityOptions = {
  prevNextButtons: false,
  pageDots: false,
  dragThreshold: 10,
  selectedAttraction: 0.01,
  friction: 0.15,
  cellAlign: 'left',
}

const SliderItemContainer = styled.figure`
  height: 35vw;
  margin: 0;
  overflow: hidden;
  img {
    height: 100%;
    object-fit: contain;
    opacity: ${props => props.dragging ? 0.5 : 1};
    /* clip-path: ${props => props.dragging ? `inset(5px 30px)` : `inset(0px 0px)`}; */
    transform: ${props => props.dragging ? `scale(0.775)` : `scale(1)`};
    transition-delay: ${props => `${(props.index + 1) * 15}ms`};
    transition: all 0.425s ${props => props.dragging ? `ease-in-out` : `ease-in-out`} ${props => `${(props.index + 1) * 25}ms`};
    /* transition-property: transform; */
  }
`

export const SlideItem = ({ img, dragging, index }) => {
  return (
    <Box as={SliderItemContainer} dragging={dragging} index={index} width={['35vw']} pr={[2, 3, `${GRID_GUTTER}px`]}>
      {img && img.file && getContentType(img.file.contentType) === CONTENT_TYPES['image'] && (
        <img
          src={img.fixed ? img.fixed.src : img.file.url}
          className="img-fluid"
          alt={`${img.description || img.id}`}
        />
      )}
    </Box>
  )
}

class ContentSlides extends Component {
  state = {
    dragging: false
  }

  componentDidMount() {

    if(this.slider) {
      this.slider.on('pointerDown', () => {
        this.setState({
          dragging: true
        })
      })
      this.slider.on('pointerUp', () => {
        this.setState({
          dragging: false
        })
      })
    }

  }

  render() {
    let { data } = this.props
    let { dragging } = this.state
    return (
      <RowContainer alignContent={ALIGN_VALUES['center']}>
        <Box as={'div'} mb={VERTICAL_SPACER}>
          {(typeof window === `object`) &&
            <Flickity flickityRef={c => this.slider = c} options={flickityOptions} elementType="article" disableImagesLoaded={true}>
              {data.medias && data.medias.map((img, index) => <SlideItem img={img} index={index} dragging={dragging} key={index} />)}
            </Flickity>
          }
        </Box>
      </RowContainer>
    )
  }
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
