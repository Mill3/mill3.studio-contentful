import React, { useState, useRef } from 'react'
import { graphql } from 'gatsby'
import { Flex, Box, Heading } from 'rebass'
import styled from 'styled-components'

import { RowContainer } from './index'
import { CalculatePaddingTop, CalculatePaddingBottom, TextColumn, format } from './ContentText'
import Button from '@components/form/Button'
import Checkbox from '@components/form/Checkbox'
import TransitionContainer from '@components/transitions/TransitionContainer'
import { space } from '@styles/Theme'

const FormField = ({ data }) => {
  const [focused, setFocus] = useState(false)
  //const [error, setError] = useState(false)
  const inputRef = useRef()

  const onFocus = () => {
    setFocus(true)
    //setError(false)
  }
  const onBlur = () => {
    const value = inputRef.current.value.trim()
    setFocus(value ? true : false)
  }
  const onError = () => {
    //setError(true)
  }

  const { label, type, slug, values, required, width } = data
  const id = `field-id-${slug}`
  const isCheckbox = type === 'radio' || type === 'checkbox'
  const columnWidth = isCheckbox ? [1] : width ? [1, null, width] : [1, null, 1/2]
  const props = {
    ref: inputRef,
    slug: slug,
    name: slug,
    required: required,
    type: type,
    id: id,
    values: values,
    onFocus: onFocus,
    onBlur: onBlur,
    onInvalid: onError,
  }

  return (
    <Flex
      as={isCheckbox ? 'div' : formInputContainer}
      focused={focused}
      flexDirection={isCheckbox ? 'row' : 'column'}
      mb={[3, 4]}
      width={columnWidth}
      py={[3, null, 0]}
      px={[2]}
    >

      {/* label */}
      <Box order={isCheckbox ? 1 : 0} as="label" htmlFor={id} pb={isCheckbox ? 0 : 2}>
        {label}
      </Box>

      {/* input container */}
      <Box order={isCheckbox ? 0 : 1} mr={isCheckbox ? 1 : 0}>
        {type === 'select' ? (
          <Select {...props}>
            <option></option>
            {/* list all values as options */}
            {values && values.map((value, index) => (
              <option value={value} key={index}>
                {value}
              </option>
            ))}
          </Select>
        ) : (
          type === 'checkbox' ? <Checkbox {...props} /> : <Input {...props} />
        )}

      </Box>
    </Flex>
  )
}

const ContentForm = props => {
  const { data, isFirst, isLast } = props
  const {
    backgroundColor,
    textColor,
    title,
    submitLabel,
    text,
    sucessMessage,
    contentfulfields,
    webhookUrl,
  } = data

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  //const [submitError, setSubmitError] = useState(false)

  const postData = async (url = '', formData) => {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: formData,
    })
    return await response.json()
  }

  const onSubmit = event => {
    event.preventDefault()
    setSubmitting(true)
    const { currentTarget } = event
    const url = currentTarget.action
    const formData = new FormData(currentTarget)
    const submit = postData(url, formData)
    submit.then(data => {
      const { status } = data
      // setSubmitting(false)
      if (status === 'success') {
        setSubmitted(true)
      } //else {
        //setSubmitError(true)
      //}
    })
  }

  const hasContent = title || text;
  const columnsWidth = [1, null, null, 1 / 2];


  return (
    <RowContainer backgroundColor={backgroundColor || null}>
      <Flex
        flexWrap={'wrap'}
        justifyContent={'center'}
        pt={CalculatePaddingTop(false, isFirst, backgroundColor)}
        pb={CalculatePaddingBottom(false, isFirst, isLast, backgroundColor)}
      >
        {/* text */}
        {hasContent &&
          <Box px={[2, 3, 3, 3, 4, 6]} width={columnsWidth}>
            <TransitionContainer>
              <Box pr={[0,0,`50px`]}>
                {title && (
                  <Heading as="h3" fontWeight="300" color={textColor || `currentColor`}>
                    {title}
                  </Heading>
                )}
                {text && (
                  <TextColumn
                    index={1}
                    text={text.content ? format(text.content) : []}
                    textColor={textColor}
                    margin={[0]}
                  />
                )}
              </Box>
            </TransitionContainer>
          </Box>
        }
        {/* form */}
        <Box
          as="aside"
          px={[2, 3, null, null, 4, 6]}
          pt={[4, null, null, 0]}
          width={columnsWidth}
          color={textColor}
        >
          <TransitionContainer>
            {!submitted && (
              <form action={webhookUrl} onSubmit={e => onSubmit(e)} method="post">
                {/* all form fields */}
                <Flex flexWrap={'wrap'} mx={[space[2] * -1]}>
                  {contentfulfields && contentfulfields.map((field, index) => (
                    <FormField key={`key-${index}`} index={index} data={field} />
                  ))}
                </Flex>
                {/* submit button */}
                <Box>
                  <Button disabled={submitting}>{submitLabel}</Button>
                </Box>
              </form>
            )}
            {submitted && sucessMessage && (
              <React.Fragment>{format(sucessMessage.content)}</React.Fragment>
            )}
          </TransitionContainer>
        </Box>
      </Flex>
    </RowContainer>
  )
}

export default ContentForm

const Input = styled.input`
  width: 100%;
  display: block;
  background: transparent;
  border: none;
  padding: 0.25rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.blue};
  border-radius: 0;
  font-family: ${props => props.theme.fonts.serifText};
  font-weight: normal;

  &:focus {
    outline: none;
  }
`

const Select = styled.select`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  display: block;
  border: none;
  padding: ${props => props.theme.space[2]}px 0;
  background: transparent;
  border-radius: 0;
  border-radius: 0px;
  border-bottom: 1px solid ${props => props.theme.colors.blue};
  font-family: ${props => props.theme.fonts.serifText};
  font-weight: normal;

  &:focus {
    outline: none;
  }
`

const formInputContainer = styled.div`
  position: relative;

  label {
    position: absolute;
    top: 50%;
    left: ${props => props.theme.space[2]}px;
    font-size: 16px;
    transform-origin: top left;
    transform: ${({ focused }) => focused ? 'translateY(-100%) scale(0.6875)' : 'translateY(-50%) scale(1)'};
    transition: transform 250ms cubic-bezier(0.215, 0.610, 0.355, 1.000); /* easeOutCubic */
    z-index: 1;
    pointer-events: none;
  }
`

export const ContentContentFormFragement = graphql`
  fragment ContentFormFragement on ContentfulContentForm {
    id
    title
    webhookUrl
    submitLabel
    text {
      text
    }
    sucessMessage {
      sucessMessage
    }
    textColor
    backgroundColor
    contentfulfields {
      label
      slug
      required
      type
      values
      width
    }
  }
`
