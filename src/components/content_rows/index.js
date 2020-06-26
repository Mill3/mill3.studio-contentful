import React, { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import posed from 'react-pose'
import { Box } from 'rebass'
import { useInView } from 'react-intersection-observer'

import ContentText from './ContentText'
import ContentImages from './ContentImages'
import ContentVideos from './ContentVideos'
import ContentSlides from './ContentSlides'
import ContentSectionBreak from './ContentSectionBreak'
import ContentForm from './ContentForm'
import ContentSpacer from './ContentSpacer'
import { LayoutContext } from '@layouts/layoutContext'
import { space } from '@styles/Theme'

export const ALIGN_VALUES = {
  snap: 'snap-both',
  center: 'center',
  left: 'snap-left',
  right: 'snap-right',
}

export const VERTICAL_ALIGN_VALUES = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
}

export const CONTENT_ROW_TYPES = {
  text: 'ContentfulContentText',
  images: 'ContentfulContentImages',
  videos: 'ContentfulContentVideos',
  slides: 'ContentfulContentSlides',
  section_break: 'ContentfulContentSectionBreak',
  form: 'ContentfulContentForm',
  spacer: 'ContentfulContentSpacer',
}

// responsive value between each row
// this value is used in Rebass margin properties
export const VERTICAL_SPACER = [4, 4, 5, 5, 6]
export const HORIZONTAL_SPACER = [`24px`, 4, 5, 5, 6]
export const HORIZONTAL_SPACER_INVERTED = [`-24px`, `${space[4] * -1}px`, `${space[5] * -1}px`, null, `${space[6] * -1}px`]
export const BOTTOM_SPACER = [4, 4, 5, 5]

// gutter between each grid elements
export const GRID_GUTTER = 45

export const RowContainer = ({ alignContent, backgroundColor, addSpacer, children }) => {
  let calculatePadding = (direction = null) => {
    // align is snapped on both side, remove all padding on any side and all breakpoints
    if (alignContent === ALIGN_VALUES['snap']) {
      return [0]
    }

    // remove padding only on left side
    if (alignContent === ALIGN_VALUES['left'] && direction === 'left') {
      return [0]
    }

    // remove padding only on right side
    if (alignContent === ALIGN_VALUES['right'] && direction === 'right') {
      return [0]
    }

    // by default, return the full spacer on both side
    return HORIZONTAL_SPACER
  }

  return (
    <Box
      pl={calculatePadding('left')}
      pr={calculatePadding('right')}
      backgroundColor={backgroundColor ? backgroundColor : null}
    >
      {children}
    </Box>
  )
}

const AnimatedBgPoses = posed.div({
  hidden: {
    opacity: 0,
    duration: ({ duration }) => duration,
  },
  visible: {
    opacity: 1,
    duration: ({ duration }) => duration,
  },
})
const AnimatedBg = styled(AnimatedBgPoses)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  transform: translate3d(0, 0px, 0);
  will-change: opacity, transform;
`

export const AnimatedBackgroundContainer = ({ backgroundColor = "transparent", duration = 250, threshold = 0, onChange = null, children }) => {
  const bgRef = useRef()
  const { layoutState } = useContext(LayoutContext)
  const { scrollbar } = layoutState
  const [ inViewRef, inView ] = useInView({ threshold: threshold })
  
  const backgroundIsTransparent = backgroundColor === "transparent"
  const scroll = ({ offset }) => {
    if( bgRef.current ) bgRef.current.style.transform = `translate3d(0, ${offset.y}px, 0)`
  }

  // listening to scrolling
  useEffect(() => {
    // remove previous listener
    scrollbar?.removeListener(scroll)

    // listen to scrolling only if bgRef exists
    if( scrollbar && bgRef.current ) scrollbar.addListener(scroll)

    return () => scrollbar?.removeListener(scroll)
  }, [scrollbar, bgRef.current])

  // run onChange callback when inView change
  useEffect(() => { if (onChange) onChange(inView) }, [inView])

  return (
    <Box ref={inViewRef} as="div">
      {/* only render background if is not transparent */}
      {!backgroundIsTransparent && <Box ref={bgRef} as={AnimatedBg} backgroundColor={backgroundColor} duration={duration} initialPose="hidden" pose={inView ? "visible" : "hidden"} withParent={false} />}
      {typeof children == `function` ? children({ inView: inView }) : children}
    </Box>
  )
}

export const AnimatedBackgroundRowContainer = ({
  backgroundColor,
  children,
  duration,
  threshold,
  onChange,
  wrapper,
  ...props
}) => {
  let Wrapper = wrapper ? wrapper : RowContainer;

  return (
    <AnimatedBackgroundContainer
      backgroundColor={backgroundColor}
      duration={duration}
      threshold={threshold}
      onChange={onChange}
    >
      <Wrapper {...props}>{typeof children == `function` ? children(props) : children}</Wrapper>
    </AnimatedBackgroundContainer>
  )
}


const GridColums = itemsPerRow => {
  // since we join the produced array with a string value,
  // we must add an extra cell to the array producing 1 more grid-column.
  // ie: 4 rows need +1. [empty, empty, empty, empty, empty] joined in a string as "1fr 1fr 1fr fr"
  const rows = parseInt(itemsPerRow) + 1
  return new Array(rows).map((item, index) => index).join('1fr ')
}

export const GridContentText = styled.div`
  display: grid;
  grid-column-gap: ${props =>
    props.gaplessGrid ? `0px` : `${props.gridGutter ? props.gridGutter : GRID_GUTTER}px`};
  grid-template-columns: 1fr;
  align-items: ${props =>
    props.alignItems ? VERTICAL_ALIGN_VALUES[props.alignItems] : `flex-start`};
  position: relative;

  @media (min-width: ${props =>
      props.itemsPerRow > 2 ? props.theme.breakpoints[2] : props.theme.breakpoints[1]}) {
    grid-row-gap: ${props =>
      props.gaplessGrid
        ? `0px`
        : `${props.gridGutter ? props.gridGutter : GRID_GUTTER}px`};
    grid-template-columns: ${props => GridColums(props.itemsPerRow || 1)};
  }
`

export const GridContentImages = styled.div`
  display: grid;
  grid-column-gap: ${props =>
    props.gaplessGrid
      ? `0px`
      : `${props.gridGutter ? props.gridGutter : GRID_GUTTER / 2}px`};
  grid-template-columns: ${props => GridColums(props.itemsPerRowMobile || 1)};
  align-items: ${props =>
    props.alignItems ? VERTICAL_ALIGN_VALUES[props.alignItems] : `flex-start`};
  position: relative;

  /* add bottom margin to image on mobile */
  @media (max-width: ${props => props.theme.breakpoints[0]}) {
    grid-row-gap: ${props =>
      props.gaplessGrid
        ? `0px`
        : `${props.gridGutter ? props.gridGutter : GRID_GUTTER / 1.75}px`};
  }

  /* grid spacing on device tablet and up */
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    grid-row-gap: ${props =>
      props.gaplessGrid
        ? `0px`
        : `${props.gridGutter ? props.gridGutter : GRID_GUTTER}px`};
    grid-template-columns: ${props => GridColums(props.itemsPerRow || 1)};
  }
`

export const Grid = GridContentText

const ContentRow = ({ data = null }) => {

  const rows = data.map((row, index) => {
    const isFirst = index === 0
    const isLast = index === data.length - 1
    const id = `content-row-id-${index}`

    switch (row.__typename) {
      case CONTENT_ROW_TYPES['text']:
        return (
          <div id={id} key={index}>
            <ContentText isFirst={isFirst} isLast={isLast} data={row} />
          </div>
        )
      case CONTENT_ROW_TYPES['images']:
        return (
          <div id={id} key={index}>
            <ContentImages isFirst={isFirst} isLast={isLast} data={row} />
          </div>
        )
      case CONTENT_ROW_TYPES['videos']:
        return (
          <div id={id} key={index}>
            <ContentVideos isFirst={isFirst} isLast={isLast} data={row} />
          </div>
        )
      case CONTENT_ROW_TYPES['slides']:
        return (
          <div id={id} key={index}>
            <ContentSlides isFirst={isFirst} isLast={isLast} data={row} />
          </div>
        )
      case CONTENT_ROW_TYPES['form']:
        return (
          <div id={id} key={index}>
            <ContentForm isFirst={isFirst} isLast={isLast} data={row} />
          </div>
        )
      case CONTENT_ROW_TYPES['spacer']:
        return (
          <div id={id} key={index}>
            <ContentSpacer isFirst={isFirst} isLast={isLast} data={row} />
          </div>
        )
      case CONTENT_ROW_TYPES['section_break']:
        return (
          <div id={id} key={index}>
            <ContentSectionBreak isFirst={isFirst} isLast={isLast} data={row} />
          </div>
        )
      default:
        //
        // push an empty row if the `__typename` is unsupported by this component
        //
        console.error(`${row.__typename} is unsupported`)
        return <span key={index}>{row.__typename} unsupported</span>
    }
  })

  return <>{rows}</>
}

ContentRow.propTypes = {
  data: PropTypes.array,
}

export default ContentRow
