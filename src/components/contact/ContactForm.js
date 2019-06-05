import React from 'react'
import { Form, Field } from 'react-final-form'
import { injectIntl } from 'react-intl'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import Button from '@components/form/Button'
import Checkbox from '@components/form/Checkbox'
import Input from '@components/form/Input'
import Select from '@components/form/Select'
import Container from '@styles/Container'
import { colors, fonts, fontSizes, space } from '@styles/Theme'


const FormStyle = styled.form`
  color: ${colors.black};
`
const FieldGroupStyle = styled.div`
  width: 100%;
  margin-bottom: ${space[6]}px;
  opacity: ${props => props.active ? 1 : 0.33};
`
const LabelStyle = styled.label`
  display: block;
  font-size: ${fontSizes[4]}px;
  font-family: ${fonts.sans};
  font-weight: 500;
`

const selectOptions = {
  project: 'project',
  cv: 'cv',
  idea: 'ideas',
  partnership: 'partnership',
}

const Error = ({ name }) => (
  <Field
    name={name}
    subscription={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span class="is-sans h6">{error}</span> : null
    }
  />
)

const ContactForm = ({int}) => {
  const onSubmit = () => {

  }
  const validate = (values) => {
    const errors = {};

    if( !values.name ) errors.name = "Required";
    if( !values.email ) errors.email = "Required";

    return errors;
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting, pristine, values }) => (

        <Container fluid bg={colors.lightGray} pr={`5vw`} css={{maxWidth: '95vw', marginRight: 0}}>
          <Flex as={FormStyle} flexDirection="column" alignItems="start" pt={6} pb={4} width={`50%`} mx="auto" onSubmit={handleSubmit}>

            <Flex flexWrap="nowrap" alignItems="center" mb={4} width={'100%'}>
              <Text as="label" className="h2 is-sans is-light" mb={0} mr={3} for="type" css={{flex: '0 0 auto'}}>Hey ! Share us your</Text>
              <Select id="type" name="type">
                {Object.entries(selectOptions).map(([key, value], index, array) => {
                  return <option value={key} key={index}>{value}</option>
                })}
              </Select>
            </Flex>

            <FieldGroupStyle active={true}>
              <LabelStyle for="name">1. You should have a name</LabelStyle>
              <Input id="name" name="name" placeholder="Type your answer here" />
              <Error name="name" />
            </FieldGroupStyle>

            <FieldGroupStyle>
              <LabelStyle for="email">2. Without a dought an email</LabelStyle>
              <Input id="email" name="email" type="email" placeholder="Type your answer here" />
              <Error name="email" />
            </FieldGroupStyle>

            <FieldGroupStyle>
              <LabelStyle for="company">3. Possibly a company name</LabelStyle>
              <Input id="company" name="company" placeholder="Type your answer here" />
            </FieldGroupStyle>

            <FieldGroupStyle>
              <LabelStyle for="project-type">4. First thing first, what's your project type</LabelStyle>
              <Input id="project-type" name="project-type" placeholder="Type your answer here" />
            </FieldGroupStyle>

            <FieldGroupStyle>
              <LabelStyle for="budget">5. Budget in mind</LabelStyle>
              <Input id="budget" name="budget" placeholder="Type your answer here" />
            </FieldGroupStyle>

            <Flex alignItems="center" mb={4}>
              <Checkbox id="subscribe" name="subscribe" value="subscribe" />
              <Text as="label" for="subscribe" fontSize={[2]} color="#4A4A4A" className="fw-300" m={0}>We share stuff, amazing stuff. Great great stuff. Make sure to get everything and subscribe.</Text>
            </Flex>

            <Button type="submit" disabled={submitting}>Send</Button>

          </Flex>
        </Container>
      )}
    />
  )
}

export default injectIntl(ContactForm)
