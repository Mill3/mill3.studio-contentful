import React, { Component, createRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass'
import { omit } from 'lodash'
import styled, { keyframes } from 'styled-components'
import axios from 'axios'
import { debounce } from 'lodash'

import Button from '@components/form/Button'
import Checkbox from '@components/form/Checkbox'
import Input from '@components/form/Input'
import Select from '@components/form/Select'
import Container from '@styles/Container'
import { colors } from '@styles/Theme'
import Viewport from '@utils/Viewport'

const FormStyle = styled.form`
  color: ${colors.black};
  select:focus {
    outline: none;
  }
`
const FieldGroupStyle = styled.div`
  width: 100%;
  opacity: ${props => (props.active ? 1 : 0.33)};
  transition: opacity 350ms linear;
`
const LabelStyle = styled.label`
  display: block;
`

const FadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

/*
const FadeOut = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
*/

const FormFooter = styled.footer`
  opacity: 0;
  animation-delay: 0.125s;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-name: ${props => (props.visible ? FadeIn : 'none')};
  display: ${props => (props.visible ? 'block' : 'none')};
`

const selectOptions = {
  select: '...',
  project: 'project',
  cv: 'cv',
  idea: 'ideas',
  partnership: 'partnership',
}

const FieldGroup = forwardRef((props, ref) => {
  const { name, label, type, active, error, onActive } = props
  const childProps = omit(props, ['name', 'label', 'type', 'children', 'active', 'error', 'onActive'])
  const onFocus = () => {
    onActive(name)
  }
  const onBlur = () => {
    onActive(null)
  }

  return (
    <Flex
      as={FieldGroupStyle}
      flexDirection="column"
      alignItems={['center', null, 'start']}
      py={5}
      active={active}
      {...childProps}
    >
      <Text as={LabelStyle} fontSize={['4.347826087vw', null, 4]} fontWeight={[300, null, 500]} htmlFor={name}>
        {label}
      </Text>
      <Input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder="Type your answer here"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error ? <span class="is-sans h6">{error}</span> : null}
    </Flex>
  )
})

class ContactForm extends Component {
  static contextTypes = {
    getScrollbar: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      activeField: null,
      selectedIndex: 0,
      monitorScroll: true,
      submitting: false,
    }

    this.formRef = createRef()
    this.typeRef = createRef()
    this.nameRef = createRef()
    this.emailRef = createRef()
    this.companyRef = createRef()
    this.projectTypeRef = createRef()
    this.budgetRef = createRef()
    this.subscribeRef = createRef()

    this.formRefs = {
      name: this.nameRef,
      email: this.emailRef,
      company: this.companyRef,
      'project-type': this.projectTypeRef,
      budget: this.budgetRef,
      subscribe: this.subscribeRef,
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onFocusChange = this.onFocusChange.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.debounced = debounce(() => this.setState({ monitorScroll: true }), 1000)
  }

  componentDidMount() {
    this.context.getScrollbar(s => {
      this.scrollbar = s
      this.scrollbar.addListener(this.onScroll)
    })
  }
  componentWillUnmount() {
    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null
  }

  onSubmit(e) {
    // prevent multiple form submission
    e.preventDefault()
    this.setState({ submitting: true })

    // collect form data
    const values = {}
    Array.from(this.formRef.current.elements).forEach(el => {
      const type = el.type
      const name = el.name
      const value = type === 'checkbox' ? (el.checked ? el.value : '') : el.value

      if (value === '') return

      values[name] = value
    })

    // send data
    axios
      .get(process.env.ZAPIER_HOOK, {
        params: {
          data: values,
        },
      })
      .then(({ data }) => {
        console.log(`Zapier response :`, data)

        if (data.status === 'success') console.log('SUCCESSFULLY SENT DATA TO ZAPIER')
        else console.log('ERROR SENDING DATA TO ZAPIER')
      })
      .finally(() => {
        this.setState({ submitting: false })
      })
      .catch(error => {
        console.log('ERROR SENDING DATA TO ZAPIER', error)
      })

    // prevent form default action
    return false
  }
  onFocusChange(field) {
    // check if field has changed
    if (field === this.state.activeField) return

    // update state and stop monitoring scroll
    this.setState({
      monitorScroll: field === null,
      activeField: field,
    })

    // if field is null (meaning no field is active), do nothing
    if (field === null) return

    // get activeField reference
    const ref = this.formRefs[field]
    if (!ref || !ref.current) return

    // calculate offset
    const vh = Viewport.height * 0.5
    const th = ref.current.getBoundingClientRect().height * 0.5

    // scroll this field into viewport vertical center
    if (this.scrollbar) this.scrollbar.scrollIntoView(ref.current, { alignToTop: true, offsetTop: vh - th })

    this.debounced()
  }
  onScroll({ offset }) {
    const { activeField, monitorScroll } = this.state

    // if enabled
    if (monitorScroll !== true) return

    const vh = Viewport.height * 0.5
    const threshold = vh * 0.5
    let distance = null
    let nearestField = null

    // check which field is nearest of viewport vertical center
    Object.keys(this.formRefs).forEach(key => {
      const ref = this.formRefs[key]
      if (!ref || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const dist = Math.abs(rect.y + rect.height * 0.5 - vh)

      if (dist > threshold) return

      if (distance === null) {
        distance = dist
        nearestField = key
      } else if (dist < distance) {
        distance = dist
        nearestField = key
      }
    })

    // if this field is currently active, do nothing
    if (activeField === nearestField) return

    // if nearestField is null, do nothing
    if (nearestField === null) return

    // update state
    // then focus on this field
    this.setState(
      {
        activeField: nearestField,
      },
      () => {
        const { activeField } = this.state
        if (activeField === null) return

        const ref = this.formRefs[activeField]
        if (!ref || !ref.current) return

        ref.current.focus()
      }
    )
  }

  render() {
    const { activeField, submitting, selectedIndex } = this.state

    return (
      <Container fluid {...this.props}>
        <Box bg={colors.lightGray} px={`5vw`}>
          <Flex
            as={FormStyle}
            ref={this.formRef}
            flexDirection="column"
            alignItems={['center', null, 'start']}
            pt={6}
            pb={6}
            width={[`100%`, null, `75%`, `50%`]}
            mx="auto"
            onSubmit={this.onSubmit}
          >
            <Flex
              flexWrap={['wrap', null, null, 'nowrap']}
              justifyContent={['center', null, 'start']}
              alignItems="center"
              pb={4}
              width={'100%'}
            >
              <Text
                as="label"
                className="is-sans is-light"
                fontSize={[4, null, 6]}
                mb={0}
                mr={[0, null, null, 3]}
                htmlFor="type"
                css={{ flex: '0 0 auto' }}
              >
                Hey ! Share us your
              </Text>
              <Select
                ref={this.typeRef}
                id="type"
                name="type"
                onChange={e => this.setState({ selectedIndex: this.typeRef.current.selectedIndex })}
              >
                {Object.entries(selectOptions).map(([key, value], index, array) => {
                  return (
                    <option value={key} key={index}>
                      {value}
                    </option>
                  )
                })}
              </Select>
            </Flex>

            <Box as={FormFooter} visible={selectedIndex > 0} pt={4}>
              <FieldGroup
                ref={this.nameRef}
                name="name"
                type="text"
                label="1. You should have a name"
                active={activeField === 'name'}
                onActive={this.onFocusChange}
              />

              <FieldGroup
                ref={this.emailRef}
                name="email"
                type="email"
                label="2. Without a dought an email"
                active={activeField === 'email'}
                onActive={this.onFocusChange}
              />

              <FieldGroup
                ref={this.companyRef}
                name="company"
                type="text"
                label="3. Possibly a company name"
                active={activeField === 'company'}
                onActive={this.onFocusChange}
              />

              <FieldGroup
                ref={this.projectTypeRef}
                name="project-type"
                type="text"
                label="4. First thing first, what's your project type"
                active={activeField === 'project-type'}
                onActive={this.onFocusChange}
              />

              <FieldGroup
                ref={this.budgetRef}
                name="budget"
                type="text"
                label="5. Budget in mind"
                active={activeField === 'budget'}
                onActive={this.onFocusChange}
              />

              <Flex as={FieldGroupStyle} py={5} alignItems="center" active={activeField === 'subscribe'}>
                <Checkbox
                  ref={this.subscribeRef}
                  id="subscribe"
                  name="subscribe"
                  value="1"
                  onFocus={e => this.onFocusChange(e.target.name)}
                />
                <Text as="label" htmlFor="subscribe" fontSize={[2]} color="#4A4A4A" className="fw-300" m={0}>
                  We share stuff, amazing stuff. Great great stuff. Make sure to get everything and subscribe.
                </Text>
              </Flex>

              <Button type="submit" disabled={submitting}>
                Send
              </Button>
            </Box>
          </Flex>
        </Box>
      </Container>
    )
  }
}

Container.defaultProps = {
  verticalSpacer: 0,
}

export default ContactForm
