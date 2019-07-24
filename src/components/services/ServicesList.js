import React from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { useInView } from 'react-intersection-observer'
import { Flex, Box, Text } from 'rebass'

import { VERTICAL_SPACER, GRID_GUTTER } from '@components/content_rows'
import { TextColumnPoses } from '@components/content_rows/ContentText'

import Container from '@styles/Container'

const ServicesGrid = styled.aside`
  display: grid;
  grid-template-columns: 1fr;
  color: ${props => props.theme.colors.gray};
  grid-column-gap: ${props => `${GRID_GUTTER}px`};
  @media (min-width: ${props => props.theme.breakpoints[2]}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const Service = ({ service, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true })
  return (
    <Box ref={ref} as={TextColumnPoses} index={index} initialPose={'hidden'} pose={inView ? 'visible' : 'hidden'}>
      <Text as={`h5`} mb={[2,3,4]}>{service.title || service.fields.title}</Text>
    </Box>
  )
}

const ServicesList = ({ data }) => {
  return (
    <Container>
      <Flex width={[1,1,1,`70vw`]} mx="auto" pt={VERTICAL_SPACER}>
        <Box as="aside" width={[1,1/5]}>
          <Text as={`h5`} fontWeight={`500`}>Services</Text>
        </Box>
        <Box as={ServicesGrid} width={[1,4/5]}>
          {data.map((service, index) => <Service service={service} key={index} index={index} />)}
        </Box>
      </Flex>
    </Container>
  )
}

export default ServicesList;