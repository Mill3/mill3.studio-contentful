import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass'
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

const NewsLink = styled.p`
  position: relative;
  padding-bottom: 6px;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    background: currentColor;
  }

  &::before {
    left: -2px;
    right: 0;
    transform-origin: top left;
    transform: scaleX(0);
  }
  &::after {
    left: 0;
    right: -2px;
    transform-origin: top right;
    transform: scaleX(1);
  }
`

const NewsPreviewItem = styled(NewsPoses)`
  a {
    display: block;
    color: #000;
    text-decoration: none !important;

    &:hover {
      ${NewsLink} {
        &::before {
          transition: transform 550ms 50ms cubic-bezier(0.645, 0.045, 0.355, 1.000); /* easeInOutCubic */
          transform: scaleX(1);
        }
        &::after {
          transition: transform 350ms cubic-bezier(0.455, 0.030, 0.515, 0.955); /* easeInOutQuad */
          transform: scaleX(0);
        }
      }
    }
  }

  figure {
    overflow: hidden;
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
              <Box as={`figure`} mb={4}>
                <FigureBox ratio={4 / 6}>
                  <Img fade={false} fluid={imageMain.fluid} />
                </FigureBox>
              </Box>
              <Flex as={`footer`} width={[`100%`, `70%`]} flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
                <Text as={`h3`} fontSize={2} fontWeight={300} lineHeight={1.2} mb={3} p={0}>
                  {title}
                </Text>
                <Text as={NewsLink} width="auto" fontSize={2} fontWeight={400} lineHeight={1.2} m={0} p={0}>
                  {intl.formatMessage({ id: 'news.preview.readmore' })}
                </Text>
              </Flex>
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
