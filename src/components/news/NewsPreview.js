import React from 'react'
import TransitionLinkComponent from '@utils/TransitionLink'
import { Box, Text } from 'rebass'
import Img from "gatsby-image"
import styled from 'styled-components'
import posed from 'react-pose'
import { useInView } from 'react-intersection-observer'

import FigureBox from '@utils/FigureBox'

const NewsPoses = posed.article({
  hidden: {
    opacity: 0,
    y: 150,
  },
  visible: {
    opacity: 1,
    y: 0,
    delay: ({ index }) => (((index % 3) + 1) * 125) + (index < 3 ? 1500 : 0),
    transition: {
      type: 'spring',
      stiffness: 50,
      mass: 1.125,
    }
  },
})

const NewsPreviewItem = styled(NewsPoses)`

  figure {
    position: relative;
    overflow: hidden;
    background: ${props => props.color};
  }

  a {
    color: #000;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
`

const NewsPreview = ({ news, index, columns }) => {
  const { slug, imageMain, title } = news.node
  const [ ref, inView ] = useInView({ triggerOnce: true })

  return (
    <Box
      as={NewsPreviewItem}
      ref={ref}
      index={index}
      initialPose={'hidden'}
      pose={ inView ? 'visible' : 'hidden' }
      pl={[2]}
      pr={[2]}
      mb={[2,2,'5vh']}
      {...columns}
    >
      <TransitionLinkComponent to={`/journal/${slug}`} title={title}>
        <Box as={`figure`} mb={[4]}>
          <FigureBox>
            <Img fade={false} fluid={imageMain.fluid} />
          </FigureBox>
        </Box>
        <footer>
          <Text as={`h3`} className={`fw-300 is-sans`} fontSize={[3,3,4]} mb={[0]}>{title}</Text>
        </footer>
      </TransitionLinkComponent>
    </Box>
  )
}


NewsPreview.defaultProps = {
  index: 0,
  columns: {
    width: 1/2,
    ml: [0],
    mr: [0],
  }
}

export default NewsPreview;
