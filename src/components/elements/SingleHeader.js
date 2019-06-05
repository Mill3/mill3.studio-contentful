import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Box, Text } from 'rebass'

import { getContentType, CONTENT_TYPES } from '@utils'
import FigureBox from '@utils/FigureBox'

const FigureVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
`

const FigureImage = styled.picture`
  height: 100%;
  margin: 0;
  img {
    height: 100%;
    object-fit: contain;
  }
`

class SingleHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  figure() {
    const { media } = this.props

    return (
      <FigureBox ratio={6 / 16} mb={[5]} overflow="hidden">
        {/* video */}
        {getContentType(media.file.contentType) === CONTENT_TYPES['video'] && (
          <Box as={FigureVideo} autoPlay loop playsInline muted>
            <source src={media.file.url} type={media.file.contentType} />
          </Box>
        )}

        {/* image type */}
        {getContentType(media.file.contentType) === CONTENT_TYPES['image'] && (
          <Box as={FigureImage}>
            <img
              src={media.file.url}
              alt={`heading figure`}
              className="img-fluid"
            />
          </Box>
        )}
      </FigureBox>
    )
  }

  render() {
    const { label, title, subHeading, media } = this.props

    return (
      <React.Fragment>

        {this.figure()}

        <Box mb={[4, 5]} px={[4, 4, 5]}>
          <Text textAlign="center" as={`h6`} fontSize={[2, 3]} color="blue">
            <FormattedMessage id={label} />
          </Text>

          <Text
            textAlign="center"
            as={`h1`}
            fontSize={[5, 4, 5, '3.611111111vw']}
            mb={0}
            className={`is-serif fw-400`}
          >
            {title}
          </Text>

          {subHeading && (
            <Text
              textAlign="center"
              as={`h4`}
              fontSize={[3, 3, `2vw`]}
              pt={[2, 4, 4]}
            >
              {subHeading}
            </Text>
          )}
        </Box>
      </React.Fragment>
    )
  }
}

SingleHeader.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subHeading: PropTypes.string,
  media: PropTypes.object,
}

export default SingleHeader
