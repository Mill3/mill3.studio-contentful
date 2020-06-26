import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from 'rebass'
import Img from 'gatsby-image'
import styled from 'styled-components'
import posed from 'react-pose'
import { useInView } from 'react-intersection-observer'
import { injectIntl } from 'gatsby-plugin-intl'


import ParallaxBox from '@components/elements/ParallaxBox'
import TransitionLinkComponent from '@components/transitions/TransitionLink'
import TransitionContainer from '@components/transitions/TransitionContainer'
import FigureBox from '@utils/FigureBox'
import ResponsiveProp from '@utils/ResponsiveProp'


const DEFAULT_COLUMNS = {
  width: 1 / 2,
  ml: [0],
  mr: [0],
}

const NewsPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 150,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ delay }) => delay,
    transition: {
      type: 'spring',
      stiffness: 30,
      mass: 0.925,
    },
  },
})

const NewsWrapper = styled(Box)`
  &:last-child {
    margin-bottom: 0 !important;
  }
`

const ReadMoreStyle = styled.p`
  display: inline-block;
  border-bottom: 1px solid ${props => props.theme.colors.gray};
`

const NewsPreviewItem = styled(NewsPoses)`
  figure {
    position: relative;
    overflow: hidden;
  }

  a {
    display: block;
    color: #000;
    text-decoration: none;

    &:hover {
      text-decoration: none;

      ${ReadMoreStyle} {
        color: ${props => props.theme.colors.blue};
        border-bottom-color: ${props => props.theme.colors.blue};
      }
    }
  }
`



const NewsPreview = ({ delay = 0, columns = DEFAULT_COLUMNS, offset = 0, news, index, intl }) => {
  const [ inViewRef, inView ] = useInView({ triggerOnce: true })
  const { slug, imageMain, title } = news.node

  return (
    <Box ref={inViewRef} as={NewsWrapper} px={[2, null, 3, '28px']} mb={['40px', null, '70px']} {...columns}>
      <ParallaxBox offset={offset}>
        <Box
          as={NewsPreviewItem}
          delay={delay instanceof ResponsiveProp ? delay.getValue() : delay}
          initialPose={'hidden'}
          pose={inView ? 'visible' : 'hidden'}
          width={'100%'}
        >
          <TransitionLinkComponent to={`/journal/${slug}`} title={title}>
            <TransitionContainer direction="out" index={index}>
              <Box as={`figure`} mb={[4]}>
                <FigureBox ratio={4 / 6}>
                  <Img fade={false} fluid={imageMain.fluid} />
                </FigureBox>
              </Box>
              <Box as={`footer`} width={[`100%`, `70%`]}>
                <Text as={`h3`} className={`fw-300 is-sans`} fontSize={[2]} lineHeight={[1.2]} mb={[2]}>
                  {title}
                </Text>
                <Text as={ReadMoreStyle} className={`fw-600 is-serif`} fontSize={[1]} m={0}>
                  {intl.formatMessage({ id: 'news.preview.readmore' })}
                </Text>
              </Box>
            </TransitionContainer>
          </TransitionLinkComponent>
        </Box>
      </ParallaxBox>
    </Box>
  )
}

NewsPreview.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
  columns: PropTypes.object,
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(ResponsiveProp)]),
}

export default injectIntl(NewsPreview)
