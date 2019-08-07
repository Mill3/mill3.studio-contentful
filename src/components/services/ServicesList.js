import React from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { useInView } from 'react-intersection-observer'
import { Flex, Box, Text } from 'rebass'

import { HORIZONTAL_SPACER, VERTICAL_SPACER, GRID_GUTTER } from '@components/content_rows'
import { TextColumnPoses } from '@components/content_rows/ContentText'
import TransitionContainer from '@components/transitions/TransitionContainer'

import Container from '@styles/Container'

const ServicesGrid = styled.aside`
  display: grid;
  grid-template-columns: 1fr;
  color: ${props => props.theme.colors.gray};
  grid-column-gap: ${props => `${GRID_GUTTER}px`};
  @media (min-width: ${props => props.theme.breakpoints[1]}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const Service = ({ service, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true })
  return (
    <div ref={ref}>
      <TransitionContainer enabled={inView} autoCalculateDelay={false} distance={25} index={index / 5}>
        <Text as={`h5`} fontSize={[1,3]} mb={[2,3,4]}>{service.title || service.fields.title}</Text>
      </TransitionContainer>
    </div>
  )
}

const ServicesList = ({ data }) => {
  return (
    <Container>
      <Flex flexWrap="no-wrap" width={[1,1,1,1,1,`80vw`]} mx="auto" pt={VERTICAL_SPACER}>
        <Box as="aside" width={[1,1/5]}>
          <TransitionContainer autoCalculateDelay={false} distance={25} index={0}>
            <Text as={`h5`} fontSize={[1,3]} fontWeight={`500`}>Services</Text>
          </TransitionContainer>
        </Box>
        <Box as={ServicesGrid} width={[1,4/5]}>
          {data.map((service, index) => <Service service={service} key={index} index={index} />)}
        </Box>
      </Flex>
    </Container>
  )
}

export default ServicesList;