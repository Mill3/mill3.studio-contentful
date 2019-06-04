import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'rebass'

const FigureBoxContainer = styled.div`
  position: relative;
  overflow: ${props => props.overflow};
  /* margin: 0; */
  /* padding: 0; */

  /* box ratio is controlled via props */
  padding-bottom: ${props => `${props.ratio * 100}%`};

  /* with gutter */
  margin-left: ${props => (props.withGutter ? `0` : `0`)};
  margin-right: ${props => (props.withGutter ? `0` : `0`)};

  /* inner shadow on top */
  &:after {
    content: '';
    height: 40%;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -1px;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    z-index: 1;
    /* control visibility via props */
    display: ${props => (props.innerShadow ? `block` : `none`)};
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

class FigureBox extends Component {

  render() {
    return (
      <Box as={FigureBoxContainer}
        ratio={this.props.ratio}
        innerShadow={this.props.innerShadow}
        withGutter={this.props.withGutter}
        overflow={this.props.overflow}
        {...this.props}
      >
        <FigureBoxInner>
          {this.props.children}
        </FigureBoxInner>
      </Box>
    )
  }
}

FigureBox.defaultProps = {
  ratio: 1 / 1,
  innerShadow: false,
  withGutter: false,
  overflow: 'visible',
}

FigureBox.propTypes = {
  children: PropTypes.object.isRequired,
  innerShadow: PropTypes.bool,
  overflow: PropTypes.string,
  ratio: PropTypes.number,
  withGutter: PropTypes.bool,
}

export default FigureBox
