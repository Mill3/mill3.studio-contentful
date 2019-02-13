import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const FigureBoxContainer = styled.div`
  position: relative;
  margin: 0;
  padding: 0;

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

class FigureBox extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <FigureBoxContainer
        ratio={this.props.ratio}
        innerShadow={this.props.innerShadow}
        withGutter={this.props.withGutter}
      >
        <FigureBoxInner>
          {this.props.children}
        </FigureBoxInner>
      </FigureBoxContainer>
    )
  }
}

FigureBox.defaultProps = {
  ratio: 1 / 1,
  innerShadow: false,
  withGutter: false,
}

FigureBox.propTypes = {
  src: PropTypes.string.isRequired,
  innerShadow: PropTypes.bool,
  ratio: PropTypes.number,
  withGutter: PropTypes.bool,
}

export default FigureBox
