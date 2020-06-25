import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'rebass'

const FigureBoxContainer = styled.div`
  position: relative;
  overflow: ${props => props.overflow};

  /* box ratio is controlled via props */
  padding-bottom: ${props => `${props.ratio * 100}%`};

  /* with gutter */
  margin-left: ${props => (props.withGutter ? `0` : `0`)};
  margin-right: ${props => (props.withGutter ? `0` : `0`)};

  /* inner shadow on top */
  &:after {
    /* control visibility via props */
    content: ${props => (props.innerShadow ? `` : `none`)};
    height: 40%;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -1px;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    z-index: 1;
    display: block;
  }
`
const FigureBoxInner = styled.div`
  border: none;
  border-image-width: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
`

const FigureBox = forwardRef(({ ratio = 1, innerShadow = false, withGutter = false, overflow = 'visible', children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      as={FigureBoxContainer}
      ratio={ratio}
      innerShadow={innerShadow}
      withGutter={withGutter}
      overflow={overflow}
      {...props}
    >
      <FigureBoxInner>
        {children}
      </FigureBoxInner>
    </Box>
  )
})

FigureBox.propTypes = {
  children: PropTypes.any.isRequired,
  innerShadow: PropTypes.bool,
  overflow: PropTypes.string,
  ratio: PropTypes.number,
  withGutter: PropTypes.bool,
}

export default FigureBox
