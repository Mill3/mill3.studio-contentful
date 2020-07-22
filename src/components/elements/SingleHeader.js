import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'gatsby-plugin-intl'
import styled from 'styled-components'
import { Flex, Box, Text } from 'rebass'

import { getContentType, CONTENT_TYPES } from '@utils'
import TransitionContainer from '@components/transitions/TransitionContainer'
import TransitionLinkComponent from '@components/transitions/TransitionLink'

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


const SingleHeader = ({ label, title, subHeading, media }) => {
  return (
    <>
      {media && <Box px={[0, 0, 0, 0, `10vw`]} my={[3, 6]}>
        {/* video */}
        {getContentType(media.file.contentType) === CONTENT_TYPES['video'] && (
          <Box as={FigureVideo} autoPlay loop playsInline muted>
            <source src={media.file.url} type={media.file.contentType} />
          </Box>
        )}

        {/* image type */}
        {getContentType(media.file.contentType) === CONTENT_TYPES['image'] && (
          <Box as={FigureImage}>
            <img src={media.file.url} alt={`heading figure`} className="img-fluid" />
          </Box>
        )}
      </Box>}

      <Flex
        flexDirection="column"
        alignItems="center"
        mx="auto"
        mb={['30px', null, 4, 5]}
        mt={!media ? ['30px', null, 6] : [0]}
        maxWidth={[null, null, '1100px', null, null, null, '2000px']}
      >
        {label && (
          <TransitionContainer distance={100}>
            <TransitionLinkComponent to={label.url} title={label.transitionTitle} color={label.transitionColor}>
              <Text as={`h6`} fontSize={[2, 3]} mb={[0, 3]} textAlign="center" color="blue">
                <FormattedMessage id={label.text} />
              </Text>
            </TransitionLinkComponent>
          </TransitionContainer>
        )}

        <TransitionContainer>
          <Text
            as={`h1`}
            textAlign="center"
            fontSize={['30px', null, 5, '3.611111111vw']}
            lineHeight={'1.2'}
            mt={[3, null, 0]}
            mb={0}
            className={`is-serif-headings fw-900`}
          >
            {title}
          </Text>
        </TransitionContainer>

        {subHeading && (
          <TransitionContainer>
            <Text
              as={`h3`}
              textAlign="center"
              fontSize={['5.35vw', '3.8vw', '2.8vw', '1.805vw']}
              pt={['24px', null, 4]}
              px={[0, 0, 0, 0, `10vw`]}
              mb={0}
            >
              {subHeading}
            </Text>
          </TransitionContainer>
        )}
      </Flex>
    </>
  )
}

SingleHeader.propTypes = {
  label: PropTypes.shape({
    text: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    transitionColor: PropTypes.string,
    transitionTitle: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  subHeading: PropTypes.string,
  media: PropTypes.object,
}

export default SingleHeader
