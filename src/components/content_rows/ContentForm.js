import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { Flex, Box, Heading } from 'rebass'
import styled from 'styled-components'

import { RowContainer, VERTICAL_SPACER, HORIZONTAL_SPACER, BOTTOM_SPACER, GRID_GUTTER } from './index'

import { CalculatePaddingTop, CalculatePaddingBottom, TextColumn, format, TEXT_COLUMN_PADDING } from './ContentText'

const Input = styled.input`
  width: 100%;
  display: block;
  background: transparent;
  border: none;
  padding: 0.25rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.blue};
  color: ${props => props.theme.colors.white};
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.white};
  }
`

const Checkbox = styled.input``

const Select = styled.select`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  display: block;
  border: none;
  padding: 0.25rem 0;
  background: transparent;
  border-radius: 0px;
  color: ${props => props.theme.colors.white};
  border-bottom: 1px solid ${props => props.theme.colors.blue};
  &:focus {
    outline: none;
  }
`

const FormInput = ({ type, id, slug, values, required }) => {
  switch (type) {
    case 'select':
      return (
        <Select required={required} type={type} id={id} name={slug}>
          <option></option>
          {/* list all values as options */}
          {values &&
            values.map((value, index) => (
              <option value={value} index={index}>
                {value}
              </option>
            ))}
        </Select>
      )
      break
    case 'checkbox':
      return <Checkbox required={required} type={type} id={id} name={slug} />
      break
    default:
      return <Input required={required} type={type} id={id} name={slug} />
      break
  }
}

const FormField = ({ data }) => {
  const { label, type, slug, values, required } = data
  const id = `form-field-${slug}`
  const isCheckbox = type === 'radio' || type === 'checkbox'
  const width = isCheckbox ? [1] : [1, 1, 1/2]
  return (
    <Flex flexDirection={isCheckbox ? 'row' : 'column'} mb={[2, 4]} width={width} px={[2]}>
      <Box order={isCheckbox ? 1 : 0} as="label" htmlFor={id} pb={isCheckbox ? 0 : 2}>
        {label}
      </Box>
      <Box order={isCheckbox ? 0 : 1} mr={isCheckbox ? 2 : 0}>
        <FormInput required={required} type={type} id={id} name={slug} values={values} />
      </Box>
    </Flex>
  )
}

class ContentForm extends Component {
  render() {
    const { data, isFirst, isLast } = this.props
    const { backgroundColor, textColor, title, text, contentfulfields } = data

    return (
      <RowContainer backgroundColor={backgroundColor || null}>
        <Flex
          flexWrap={'wrap'}
          pt={CalculatePaddingTop(false, isFirst)}
          pb={CalculatePaddingBottom(false, isFirst, isLast)}
        >
          {/* text */}
          <Box px={[2, 3, 4, 5, 6]} width={[1, 1, 1, 1 / 2]}>
            {title && (
              <Heading as="h3" fontWeight="300" color={textColor || `currentColor`}>
                {title}
              </Heading>
            )}
            {text && (
              <TextColumn
                index={1}
                text={text ? format(text.text || text.content) : []}
                textColor={textColor}
                margin={[0]}
              />
            )}
          </Box>
          {/* form */}
          <Box as="form" px={[2, 3, 4, 5, 6]} width={[1, 1, 1, 1 / 2]} color={textColor}>
            {/* all form fields */}
            <Flex flexWrap={'wrap'}>
              {contentfulfields && contentfulfields.map((field, index) => <FormField index={index} data={field} />)}
            </Flex>
            <Box>
              <button>Submit</button>
            </Box>
          </Box>
        </Flex>
      </RowContainer>
    )
  }
}

export default ContentForm

export const ContentContentFormFragement = graphql`
  fragment ContentFormFragement on ContentfulContentForm {
    id
    title
    text {
      text
    }
    textColor
    backgroundColor
    contentfulfields {
      label
      slug
      required
      type
      values
    }
  }
`
