import React from 'react'
import PropTypes from 'prop-types'
import { useInView } from 'react-intersection-observer'
import { Form, Field/*, useForm*/ } from 'react-final-form'
import { injectIntl } from 'react-intl'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import axios from 'axios'

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
  padding: ${space[5]}px 0;
  opacity: ${props => props.active ? 1 : 0.33};
  transition: opacity 350ms linear;
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


const FieldGroup = ({ name, children, onScroll }) => {
  const [ref, inView, entry] = useInView({rootMargin: '-50% 0px', threshold: 0})
  //const formApi = useForm();

  return (
    <Field name={name} subscription={{ active: true }}>
      {({ meta: { active } }) => {
        if( active && !inView ) {
          if( typeof onScroll === 'function' ) onScroll(entry.target);
        }
        else if( inView && !active ) {
          console.log(`focus on ${name}`);
          //formApi.getFieldState(name).focus();
        }

        return (
          <FieldGroupStyle ref={ref} active={active || inView}>
            { children }
            <Error name={name} />
          </FieldGroupStyle>
        )
      }}
    </Field>
  )
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

const ContactForm = (props, context) => {
  const onSubmit = (values) => {
    return new Promise((resolve, reject) => {
      axios
        .get(process.env.ZAPIER_HOOK, {
          params: {
            data: values,
          },
        })
        .then(({ data }) => {
          console.log(`Zapier response :`, data);

          if( data.status === 'success' ) resolve()
          else reject();
        })
        .catch((error) => {
          reject();
        })
    })
  }
  const validate = (values) => {
    const errors = {};

    //if( !values.name ) errors.name = "Required";
    //if( !values.email ) errors.email = "Required";

    return errors;
  }
  const onFieldScroll = (target) => {
    if( scrollbar ) {
      const vh = window.innerHeight * 0.5;
      const th = target.getBoundingClientRect().height * 0.5;

      scrollbar.scrollIntoView(target, {alignToTop: true, offsetTop: vh - th});
    }
  }

  let scrollbar;
  context.getScrollbar(s => scrollbar = s)

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting, values }) => (

        <Container fluid bg={colors.lightGray} pr={`5vw`} css={{maxWidth: '95vw', marginRight: 0}}>
          <Flex as={FormStyle} flexDirection="column" alignItems="start" pt={6} pb={4} width={`50%`} mx="auto" onSubmit={handleSubmit}>

            <Flex flexWrap="nowrap" alignItems="center" pb={4} width={'100%'}>
              <Text as="label" className="h2 is-sans is-light" mb={0} mr={3} htmlFor="type" css={{flex: '0 0 auto'}}>Hey ! Share us your</Text>
              <Select id="type" name="type" defaultValue={Object.values(selectOptions).shift()}>
                {Object.entries(selectOptions).map(([key, value], index, array) => {
                  return <option value={key} key={index}>{value}</option>
                })}
              </Select>
            </Flex>

            <FieldGroup name="name" onScroll={onFieldScroll}>
              <LabelStyle htmlFor="name">1. You should have a name</LabelStyle>
              <Input id="name" name="name" placeholder="Type your answer here" />
            </FieldGroup>

            <FieldGroup name="email" onScroll={onFieldScroll}>
              <LabelStyle htmlFor="email">2. Without a dought an email</LabelStyle>
              <Input id="email" name="email" type="email" placeholder="Type your answer here" />
            </FieldGroup>

            <FieldGroup name="company" onScroll={onFieldScroll}>
              <LabelStyle htmlFor="company">3. Possibly a company name</LabelStyle>
              <Input id="company" name="company" placeholder="Type your answer here" />
            </FieldGroup>

            <FieldGroup name="project-type" onScroll={onFieldScroll}>
              <LabelStyle htmlFor="project-type">4. First thing first, what's your project type</LabelStyle>
              <Input id="project-type" name="project-type" placeholder="Type your answer here" />
            </FieldGroup>

            <FieldGroup name="budget" onScroll={onFieldScroll}>
              <LabelStyle htmlFor="budget">5. Budget in mind</LabelStyle>
              <Input id="budget" name="budget" placeholder="Type your answer here" />
            </FieldGroup>

            <Flex as={FieldGroup} alignItems="center" mt={4} mb={4} name="subscribe" onScroll={onFieldScroll}>
              <Checkbox id="subscribe" name="subscribe" value="1" />
              <Text as="label" htmlFor="subscribe" fontSize={[2]} color="#4A4A4A" className="fw-300" m={0}>We share stuff, amazing stuff. Great great stuff. Make sure to get everything and subscribe.</Text>
            </Flex>

            <Button type="submit" disabled={submitting}>Send</Button>

          </Flex>
        </Container>
      )}
    />
  )
}

ContactForm.contextTypes = {
  getScrollbar: PropTypes.func,
}

export default injectIntl(ContactForm)
