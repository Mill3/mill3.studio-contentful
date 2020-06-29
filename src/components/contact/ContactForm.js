import React, { forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { injectIntl, FormattedMessage } from 'gatsby-plugin-intl'
import { Box, Flex, Text } from 'rebass'
import posed from 'react-pose'
import styled from 'styled-components'
import axios from 'axios'
import { debounce } from 'lodash'
import { isBrowser } from 'react-device-detect'

import Button from '@components/form/Button'
import Checkbox from '@components/form/Checkbox'
import Input from '@components/form/Input'
import { LayoutContext } from '@layouts/layoutContext'
import { space } from '@styles/Theme'
import ResponsiveProp from '@utils/ResponsiveProp'
import Viewport from '@utils/Viewport'

const BackgroundScaleX = new ResponsiveProp([1, null, 0.9])

const BgPoses = posed.div({
  default: {
    scaleX: () => BackgroundScaleX.getValue(),
    scaleY: 1.0,
  },
  hover: {
    scaleX: () => BackgroundScaleX.getValue(),
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
  opacity: ${props => (props.active ? 1 : 0.33)};
  transition: opacity 350ms linear;

  &:hover {
    opacity: 1;
  }
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


const FieldGroup = forwardRef(({ name, label, placeholder, type, active, error, onActive, validate, children, ...restProps }, ref) => {

  const onFocus = useCallback(() => { onActive(name) })
  const onBlur = useCallback(() => { onActive(null) })

  return (
    <Flex
      as="div"
      width={1}
      py={5}
      {...restProps}
    >
      <Flex as={FieldGroupStyle} width={1} flexDirection="column" alignItems={'center'} active={active}>
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
          {...validate}
        />
        {error ? <span className="is-sans h6">{error}</span> : null}
      </Flex>
    </Flex>
  )
})


const ContactForm = ({opened = false, expandable = true, intl, ...rest }) => {
  const { layoutState } = useContext(LayoutContext)
  const [ activeField, setActiveField ] = useState(null)
  const [ expanded, setExpanded ] = useState(opened)
  const [ hoverToggleButton, setHoverToggleButton ] = useState(false)
  const [ monitorScroll, setMonitorScroll ] = useState(opened)
  const [ submitting, setSubmitting ] = useState(false)
  const [ submitted, setSubmitted ] = useState(false)

  const scrollbarRef = useRef()
  const sectionRef = useRef()
  const formRef = useRef()
  const nameRef = useRef()
  const emailRef = useRef()
  const companyRef = useRef()
  const projectTypeRef = useRef()
  const budgetRef = useRef()
  const subscribeRef = useRef()
  const formRefs = useRef({
    name: nameRef,
    email: emailRef,
    company: companyRef,
    'project-type': projectTypeRef,
    budget: budgetRef,
    subscribe: subscribeRef,
  })  
  const stateRef = useRef({
    activeField,
    monitorScroll,
    submitted,
  })


  const thenMonitorScroll = useCallback( debounce(() => setMonitorScroll(true), 1000) )
  const submit = useCallback((event) => {
    // prevent multiple form submission
    event.preventDefault()

    // update state
    setSubmitting(true)

    // collect form data
    const values = {}
    if( formRef.current ) {
      Array.from(formRef.current.elements).forEach(el => {
        const { type, name } = el
        const value = type === 'checkbox' ? (el.checked ? el.value : '') : el.value

        if (value === '') return

        values[name] = value
      })
    }

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
        formRef.current?.reset()

        setSubmitting(false)
        setSubmitted(true)
        setExpanded(!expandable)
        setMonitorScroll(false)
      })
      .catch(error => {
        console.log('ERROR SENDING DATA TO ZAPIER', error)
      })

    // prevent form default action
    return false
  })

  const onFocusChange = useCallback((field) => {
    // check if field has changed
    if (field === stateRef.current.activeField) return

    // update state and stop monitoring scroll
    setMonitorScroll(field === null)
    setActiveField(field)

    // if field is null (meaning no field is active), do nothing
    if (field === null) return

    // get activeField reference
    const ref = formRefs.current[field]
    if (!ref || !ref.current) return

    // calculate offset
    const vh = Viewport.height * 0.5
    const th = ref.current.getBoundingClientRect().height * 0.5

    // scroll this field into viewport vertical center
    scrollbarRef.current?.scrollIntoView(ref.current, { alignToTop: true, offsetTop: vh - th })

    // restart scroll monitoring
    thenMonitorScroll()
  })
  const onCheckboxFocusChange = useCallback((event) => { onFocusChange(event.target.name) })

  const scroll = useCallback(({ offset }) => {
    const { monitorScroll, submitted } = stateRef.current

    // if scrolling is not monitored or form has been submitted, skip here
    if (!monitorScroll || submitted) return

    const vh = Viewport.height * 0.5
    const threshold = vh * 0.5

    let distance = null
    let nearestField = null

    // check which field is nearest of viewport vertical center
    Object.keys(formRefs.current).forEach(key => {
      const ref = formRefs.current[key]
      if (!ref || !ref.current) return
      
      const { y, height } = ref.current.getBoundingClientRect()
      const dist = Math.abs(y + height * 0.5 - vh)

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
    if (stateRef.current.activeField === nearestField) return

    // if nearestField is null, do nothing
    if (nearestField === null) return

    // update active field state
    setActiveField(nearestField)
  })


  // scrollbar handling
  useEffect(() => {
    // remove previous listeners
    scrollbarRef.current?.removeListener(scroll)

    // save reference
    scrollbarRef.current = layoutState.scrollbar

    // add listener
    scrollbarRef.current?.addListener(scroll)

    // remove listener when unmounted
    return () => scrollbarRef.current?.removeListener(scroll)
  }, [layoutState.scrollbar])

  // update stateRef because we need to access some state values in useCallabck functions
  useEffect(() => {
    stateRef.current = {
      ...stateRef.current,
      ...{
        activeField,
        monitorScroll,
        submitted,
      },
    }
  }, [activeField, monitorScroll, submitted])


  // scroll section into viewport when form is submitted
  useLayoutEffect(() => {
    if( submitted ) scrollbarRef.current?.scrollIntoView(sectionRef.current, { alignToTop: false })
  }, [submitted])

  // focus on activeField if we are monitoring scroll and form isn't submitted
  useLayoutEffect(() => {
    if ( !activeField || !monitorScroll || submitted || !isBrowser ) return
    
    const ref = formRefs.current[activeField]
          ref?.current?.focus()
  }, [activeField, monitorScroll, submitted])



  return (
    <Flex
      ref={sectionRef}
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
        pose={expanded ? 'expanded' : (hoverToggleButton ? "hover" : "default")}
      />

      <Text
        as={IntroStyle}
        className="is-sans is-light"
        fontSize={['6.763285024vw', null, '3.5vw', '2.222222222vw']}
        textAlign="center"
        lineHeight={1.357142857}
        m={0}
        py={4}
        disabled={!expandable}
        visible={!submitted}
        width={expanded ? "auto" : ["calc(100% - 48px)", `calc(100% - ${space[4] * 2}px)`, 0.9]}
        initialPose="default"
        pose={expanded ? "disabled" : "default"}
        onClick={() => {
          setExpanded(!expanded)
          setMonitorScroll(!expanded)
        }}
        onFocus={() => setHoverToggleButton(true)}
        onBlur={() => setHoverToggleButton(false)}
        onMouseOver={() => setHoverToggleButton(true)}
        onMouseOut={() => setHoverToggleButton(false)}
        style={{position: 'relative', zIndex: 1}}
      >
        <FormattedMessage id="contact.FormIntroLine" />
      </Text>

      <Flex
        as={FormStyle}
        ref={formRef}
        flexDirection="column"
        alignItems="center"
        width="100%"
        mx="auto"
        onSubmit={submit}
        disabled={submitting || submitted ? true : false}
        style={{position: 'relative'}}
      >
        <Box as={FormFooter} width={[`100%`, `100%`, `75%`, `60%`, `50%`]} mx="auto" py={expanded && !submitted ? 4 : 0} visible={expanded && !submitted}>
          <Box py={5}>
            <FieldGroup
              ref={nameRef}
              name="name"
              type="text"
              label={intl.formatMessage({id: 'fields.name'})}
              placeholder={intl.formatMessage({id: 'fields.placeholder'})}
              active={activeField === 'name'}
              onActive={onFocusChange}
              validate={{
                required: true
              }}
            />

            <FieldGroup
              ref={emailRef}
              name="email"
              type="email"
              label={intl.formatMessage({id: 'fields.email'})}
              placeholder={intl.formatMessage({id: 'fields.placeholder'})}
              active={activeField === 'email'}
              onActive={onFocusChange}
              validate={{
                required: true
              }}
            />

            <FieldGroup
              ref={companyRef}
              name="company"
              type="text"
              label={intl.formatMessage({id: 'fields.company'})}
              placeholder={intl.formatMessage({id: 'fields.placeholder'})}
              active={activeField === 'company'}
              onActive={onFocusChange}
            />

            <FieldGroup
              ref={projectTypeRef}
              name="project-type"
              type="text"
              label={intl.formatMessage({id: 'fields.project'})}
              placeholder={intl.formatMessage({id: 'fields.placeholder'})}
              active={activeField === 'project-type'}
              onActive={onFocusChange}
              validate={{
                required: true
              }}
            />

            <FieldGroup
              ref={budgetRef}
              name="budget"
              type="text"
              label={intl.formatMessage({id: 'fields.budget'})}
              placeholder={intl.formatMessage({id: 'fields.placeholder'})}
              active={activeField === 'budget'}
              onActive={onFocusChange}
              validate={{
                required: true
              }}
            />

            <Flex as="div" width={1} py={5} alignItems="center" active={activeField === 'subscribe'}>
              <Flex as={FieldGroupStyle} width={1} alignItems="center">
                <Checkbox
                  ref={subscribeRef}
                  id="subscribe"
                  name="subscribe"
                  value="1"
                  onFocus={onCheckboxFocusChange}
                />
                <Text as="label" htmlFor="subscribe" fontSize={[2, null, null, '1.25vw']} className="fw-300" m={0}>
                  <FormattedMessage id="contact.Subscribe" />
                </Text>
              </Flex>
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

export default injectIntl(ContactForm)
