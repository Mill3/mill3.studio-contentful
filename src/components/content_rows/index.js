import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'rebass'
import { InView } from 'react-intersection-observer'

import { LayoutContext } from '@layouts/layoutContext'
import ContentText from './ContentText'
import ContentImages from './ContentImages'
import ContentVideos from './ContentVideos'
import ContentSlides from './ContentSlides'
import ContentSectionBreak from './ContentSectionBreak'
import ContentForm from './ContentForm'
import ContentSpacer from './ContentSpacer'
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

const AnimatedBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  opacity: ${props => props.opacity};
  transform: translate3d(0, 0px, 0);
  transition: opacity ${props => props.duration}ms linear;
`

export class AnimatedBackgroundContainer extends Component {

  static contextType = LayoutContext;

  constructor(props) {
    super(props)

    this.state = {
      inView: false,
    }

    this.mounted = false
    this.scrollbar = false;
    this.exitViewportTicker = null

    this.onVisibilityChange = this.onVisibilityChange.bind(this)
    this.onExitCompleted = this.onExitCompleted.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidUpdate() {
    if(this.scrollbar) return
    if(this.context.layoutState.scrollbar) {
      this.mounted = true
      this.scrollbar = this.context.layoutState.scrollbar

      if( this.state.inView ) {
        // cancel timeout if exists
        if (this.exitViewportTicker) clearTimeout(this.exitViewportTicker)
        this.exitViewportTicker = null

        // first, remove listener to prevent doubling, then add scroll listener
        this.scrollbar.removeListener(this.onScroll)
        this.scrollbar.addListener(this.onScroll)
      }
    }
  }

  componentWillUnmount() {
    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null

    // cancel timeout
    if (this.exitViewportTicker) clearTimeout(this.exitViewportTicker)
    this.exitViewportTicker = null
    this.mounted = false
  }

  onVisibilityChange(inView) {
    // if component is not mounted, do nothing because it will create lots of underlying bug
    if( !this.mounted ) return

    if (inView) {
      // if already in view, skip
      if (this.state.inView === true) return

      // cancel timeout
      clearTimeout(this.exitViewportTicker)

      // register scroll listener
      if (this.scrollbar && !this.exitViewportTicker)
        this.scrollbar.addListener(this.onScroll)

      // destroy timeout
      this.exitViewportTicker = null

      // update state
      this.setState({
        inView: true,
        y: this.scrollbar ? this.scrollbar.offset.y : 0,
      })

      const { onChange } = this.props
      if (onChange) onChange(true)
    } else {
      // if already outside of viewport, skip
      if (this.state.inView === false) return

      // cancel timeout
      clearTimeout(this.exitViewportTicker)
      this.exitViewportTicker = null

      // update state
      this.setState(
        { inView: false },
        () =>
          (this.exitViewportTicker = setTimeout(
            this.onExitCompleted,
            this.props.duration
          ))
      )

      const { onChange } = this.props
      if (onChange) onChange(false)
    }
  }
  onExitCompleted() {
    // destroy timeout
    this.exitViewportTicker = null

    // unregister scroll listener
    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
  }
  onScroll({ offset }) {
    if( !this.mounted ) return

    this.setState({
      y: offset.y,
    })
  }

  render() {
    const { backgroundColor, children, duration, threshold } = this.props
    const { inView, y } = this.state
    const t = { transform: `translate3d(0, ${y}px, 0)` }

    return (
      <InView as={Box} onChange={this.onVisibilityChange} threshold={threshold || 0}>
        <Box
          as={AnimatedBg}
          backgroundColor={backgroundColor}
          opacity={inView ? 1 : 0}
          duration={duration || 250}
          style={t}
        />
        {typeof children == `function` ? children({ inView: inView }) : children}
      </InView>
    )
  }
}

AnimatedBackgroundContainer.contextType = LayoutContext;

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

class ContentRow extends Component {
  rows() {
    return this.props.data.map((row, index) => {
      // console.log('index:', index, index === 0)
      let isFirst = index === 0
      let isLast = index === this.props.data.length - 1
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
  }

  render() {
    return <React.Fragment>{this.props.data ? this.rows() : ''}</React.Fragment>
  }
}

ContentRow.propTypes = {
  data: PropTypes.array,
}

ContentRow.defaultProps = {
  data: null,
}

export default ContentRow
