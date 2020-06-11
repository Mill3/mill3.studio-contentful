import React, { Component, createRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Box, Flex, Text } from 'rebass'
import posed from 'react-pose'
import { omit } from 'lodash'
import styled from 'styled-components'
import axios from 'axios'
import { debounce } from 'lodash'
import { isBrowser } from 'react-device-detect'


import Button from '@components/form/Button'
import Checkbox from '@components/form/Checkbox'
import Input from '@components/form/Input'
import { space } from '@styles/Theme'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'

const BackgroundScaleX = new ResponsiveProp([
  () => (Viewport.width - 48) / Viewport.width,
  () => (Viewport.width - space[4] * 2) / Viewport.width,
  () => 0.9,
])

const BgPoses = posed.div({
  default: {
    scaleX: () => BackgroundScaleX.getValue()(),
    scaleY: 1.0,
  },
  hover: {
    scaleX: () => BackgroundScaleX.getValue()(),
    scaleY: 1.1,
    transition: {
      type: 'tween',
      duration: 450,
      easing: [0.65, 0.05, 0.36, 1],
    }
  },
  expanded: {
    scaleX: 1.0,
    scaleY: 1.0,
    transition: {
      scaleY: { duration: 0 },
      default: { type: 'tween', duration: 450, easing: [0.65, 0.05, 0.36, 1] }
    }
  }
})
const IntroPoses = posed.h4({
  default: {
    y: 0,
  },
  disabled: {
    y: space[5],
    transition: {
      type: 'tween',
      duration: 450,
      easing: 'easeOut'
    }
  },
})

const BgStyle = styled(BgPoses)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform-origin: center center;
`
const FormStyle = styled.form`
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  opacity: ${props => props.disabled ? 0.25 : 1};

  select:focus {
    outline: none;
  }
`
const IntroStyle = styled(IntroPoses)`
  cursor: pointer;
  display: ${({ visible }) => visible ? 'block' : 'none'};
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};

  ${({ disabled, pose }) => !disabled && `
      &::after {
        content: '→';
        display: inline-block;
        margin-left: 0.25em;
        font-size: 80%;
        transform-origin: center center;
        transform: rotate(${pose === "disabled" ? -90 : 90}deg);
      }
    `
  }}
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
      {error ? <span className="is-sans h6">{error}</span> : null}
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
      hoverToggleButton: false,
      monitorScroll: false,
      submitting: false,
      submitted: false,
      scrollY: 0,
    }

    this.mounted = false
    this.sectionRef = createRef()
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
        if( this.mounted ) {
          if( this.formRef.current ) this.formRef.current.reset()

          this.setState({
            submitting: false,
            submitted: true,
            expanded: false,
            monitorScroll: false
          }, () => {
            if( this.scrollbar ) this.scrollbar.scrollIntoView(this.sectionRef.current, {
              alignToTop: false
            });
          })
        }
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
    const { activeField, expanded, submitting, submitted, hoverToggleButton } = this.state
    const { intl, expandable = true, ...rest } = this.props

    return (
      <Flex
        ref={this.sectionRef}
        as="section"
        flexDirection="column"
        alignItems="center"
        color="white"
        style={{position: 'relative'}}
        {...rest}
      >
        <Box
          as={BgStyle}
          bg="black"
          initialPose="default"
          pose={expanded ? 'expanded': (hoverToggleButton ? "hover" : "default")}
        />

        <Text
          as={IntroStyle}
          className="is-sans is-light"
          fontSize={['7.729468599vw', null, '3.5vw', '2.222222222vw']}
          textAlign="center"
          m={0}
          py={4}
          disabled={!expandable}
          visible={!submitted}
          width={expanded ? "auto" : ["calc(100% - 48px)", `calc(100% - ${space[4] * 2}px)`, 0.9]}
          initialPose="default"
          pose={expanded ? "disabled" : "default"}
          onClick={() => this.setState({expanded: !expanded, monitorScroll: !expanded})}
          onFocus={() => this.setState({hoverToggleButton: true})}
          onBlur={() => this.setState({hoverToggleButton: false})}
          onMouseOver={() => this.setState({hoverToggleButton: true})}
          onMouseOut={() => this.setState({hoverToggleButton: false})}
          style={{position: 'relative', zIndex: 1}}
        >
          <FormattedMessage id="contact.FormIntroLine" />
        </Text>

        <Flex
          as={FormStyle}
          ref={this.formRef}
          flexDirection="column"
          alignItems="center"
          width="100%"
          mx="auto"
          onSubmit={this.onSubmit}
          disabled={submitting || submitted ? true : false}
          style={{position: 'relative'}}
        >
          <Box as={FormFooter} width={[`100%`, `100%`, `75%`, `60%`, `50%`]} mx="auto" py={expanded ? 4 : 0} visible={expanded}>
            <Box py={5}>
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
                <Button type="submit" color="white" disabled={submitting}>
                  {intl.formatMessage({id: 'submit'}).toString()}
                </Button>
              </Flex>
            </Box>
          </Box>
        </Flex>

        {/* confirm message at the end */}
        <Box as={ConfirmMessage} visible={submitted} style={{position: 'relative'}}>
          <Text
            as="h4"
            className="is-sans is-light"
            textAlign="center"
            fontSize={['7.729468599vw', null, '5.2vw', '2.222222222vw']}
            m={0}
            py={4}
          >
            <FormattedMessage id="contact.ThankYou" />
          </Text>
        </Box>

      </Flex>
    )
  }
}

export default injectIntl(ContactForm)
