import React, { Component, createRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Box, Flex, Text } from 'rebass'
import { omit } from 'lodash'
import styled from 'styled-components'
import axios from 'axios'
import { debounce } from 'lodash'
import { isBrowser } from 'react-device-detect'


import Button from '@components/form/Button'
import Checkbox from '@components/form/Checkbox'
import Input from '@components/form/Input'
import Container from '@styles/Container'
import Viewport from '@utils/Viewport'

const FormStyle = styled.form`
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  opacity: ${props => props.disabled ? 0.25 : 1};

  select:focus {
    outline: none;
  }
`
const IntroStyle = styled.h4`
  pointer-events: ${props => props.disabled ? 'none' : 'auto' };
  cursor: pointer;

  &::after {
    content: '→';
    display: inline-block;
    margin-left: 0.25em;
    font-size: 80%;
    transform-origin: center center;
    transform: rotate(90deg);
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

const FormFooter = styled.footer`
  height: ${props => props.visible ? 'auto' : '0px'};
  opacity: ${props => props.visible ? 1 : 0};
  overflow: hidden;
  transition: opacity 1s linear;
`
const ConfirmMessage = styled.footer`
  height: ${props => props.visible ? 'auto' : '0px'};
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 1s linear;
`

const FieldGroup = forwardRef((props, ref) => {
  const { name, label, placeholder, type, active, error, onActive, validate } = props
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
      alignItems={'center'}
      py={5}
      active={active}
      {...childProps}
    >
      <Text as={LabelStyle} fontSize={['4.347826087vw', null, '3vw', '1.944444444vw']} fontWeight={[300, null, 500]} htmlFor={name}>
        {label}
      </Text>
      <Input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmit={e => console.log(e)}
        {...validate}
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
      expanded: false,
      monitorScroll: false,
      submitting: false,
      submitted: false,
      scrollY: 0,
    }

    this.mounted = false
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
    this.mounted = true

    this.context.getScrollbar(s => {
      this.scrollbar = s
      if( this.mounted ) this.scrollbar.addListener(this.onScroll)
    })

    if( this.props.opened === true ) this.setState({expanded: true, monitorScroll: true})
  }

  componentWillUnmount() {
    if (this.scrollbar) this.scrollbar.removeListener(this.onScroll)
    this.scrollbar = null

    this.mounted = false
  }

  onSubmit(e) {
    // prevent multiple form submission
    e.preventDefault()
    if( this.mounted ) this.setState({ submitting: true })

    // collect form data
    const values = {}

    if( this.formRef && this.formRef.current ) {
      Array.from(this.formRef.current.elements).forEach(el => {
        const type = el.type
        const name = el.name
        const value = type === 'checkbox' ? (el.checked ? el.value : '') : el.value

        if (value === '') return

        values[name] = value
      })
    }

    this.submit(values)

    // prevent form default action
    return false
  }

  submit(values) {
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
        if( this.mounted ) this.setState({ submitted: true })
      })
      .catch(error => {
        console.log('ERROR SENDING DATA TO ZAPIER', error)
      })
  }

  onFocusChange(field) {
    // module has been unmounted
    if (!this.mounted ) return

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
    // module has been unmounted
    if (!this.mounted ) return

    const { activeField, monitorScroll, submitted } = this.state

    if( this.props.snapIcon !== true ) this.setState({ scrollY: offset.y })

    // if enabled or before has submitted
    if (monitorScroll !== true || submitted === true) return

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

        // focus only if browser is desktop
        if (isBrowser && !submitted) {
          ref.current.focus()
        }
      }
    )
  }

  render() {
    const { activeField, expanded, submitting, submitted } = this.state
    const { intl } = this.props

    return (
      <Box {...this.props} bg={'#000'} color={`white`} px={`5vw`} py={4} mx={[0, null, 4]}>
        <Container fluid>

          <Flex
            as={FormStyle}
            ref={this.formRef}
            flexDirection="column"
            alignItems="center"
            width="100%"
            mx="auto"
            onSubmit={this.onSubmit}
            disabled={submitting || submitted ? true : false}
          >
            <Text
              as={IntroStyle}
              className="is-sans is-light"
              fontSize={['7.729468599vw', null, '5.2vw', '2.222222222vw']}
              m={0}
              disabled={expanded}
              onClick={() => this.setState({expanded: true, monitorScroll: true})}
            >
              {intl.formatMessage({id: 'contact.FormIntroLine'})}
            </Text>

            <Box as={FormFooter} width={[`100%`, `100%`, `75%`, `60%`, `50%`]} mx="auto" visible={expanded}>
              <Box pt={4} pb={5}>
                <FieldGroup
                  ref={this.nameRef}
                  name="name"
                  type="text"
                  label={intl.formatMessage({id: 'fields.name'})}
                  placeholder={intl.formatMessage({id: 'fields.placeholder'})}
                  active={activeField === 'name'}
                  onActive={this.onFocusChange}
                  validate={{
                    required: true
                  }}
                />

                <FieldGroup
                  ref={this.emailRef}
                  name="email"
                  type="email"
                  label={intl.formatMessage({id: 'fields.email'})}
                  placeholder={intl.formatMessage({id: 'fields.placeholder'})}
                  active={activeField === 'email'}
                  onActive={this.onFocusChange}
                  validate={{
                    required: true
                  }}
                />

                <FieldGroup
                  ref={this.companyRef}
                  name="company"
                  type="text"
                  label={intl.formatMessage({id: 'fields.company'})}
                  placeholder={intl.formatMessage({id: 'fields.placeholder'})}
                  active={activeField === 'company'}
                  onActive={this.onFocusChange}
                />

                <FieldGroup
                  ref={this.projectTypeRef}
                  name="project-type"
                  type="text"
                  label={intl.formatMessage({id: 'fields.project'})}
                  placeholder={intl.formatMessage({id: 'fields.placeholder'})}
                  active={activeField === 'project-type'}
                  onActive={this.onFocusChange}
                  validate={{
                    required: true
                  }}
                />

                <FieldGroup
                  ref={this.budgetRef}
                  name="budget"
                  type="text"
                  label={intl.formatMessage({id: 'fields.budget'})}
                  placeholder={intl.formatMessage({id: 'fields.placeholder'})}
                  active={activeField === 'budget'}
                  onActive={this.onFocusChange}
                  validate={{
                    required: true
                  }}
                />

                <Flex as={FieldGroupStyle} py={5} alignItems="center" active={activeField === 'subscribe'}>
                  <Checkbox
                    ref={this.subscribeRef}
                    id="subscribe"
                    name="subscribe"
                    value="1"
                    onFocus={e => this.onFocusChange(e.target.name)}
                  />
                  <Text as="label" htmlFor="subscribe" fontSize={[2, null, null, '1.25vw']} className="fw-300" m={0}>
                    <FormattedMessage id="contact.Subscribe" />
                  </Text>
                </Flex>

                <Flex justifyContent={"center"}>
                  {/* hiddens fields */}
                  <input type="hidden" name="language" value={intl.locale} />
                  <Button type="submit" disabled={submitting}>
                    {intl.formatMessage({id: 'submit'}).toString()}
                  </Button>
                </Flex>
              </Box>
            </Box>

          </Flex>

          {/* confirm message at the end */}
          <Box as={ConfirmMessage} visible={submitted}>
            <Text as="h3" className="is-sans is-light" textAlign="center" fontSize={[4, null, 6]} py={[2,3,5]}>
              <FormattedMessage id="contact.ThankYou" />
            </Text>
          </Box>

        </Container>
      </Box>
    )
  }
}

export default injectIntl(ContactForm)
