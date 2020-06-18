import React from 'react';
import styled from 'styled-components'
import { Box, Heading } from 'rebass'

const PersonPreview = ({ person }) => {
  return (
    <Box>
      <Box as={FigureContainer} mb={3}>
        <img srcSet={person.photo.fluid.srcSet} alt={person.fullname} className="img-fluid" />
      </Box>
      <figcaption>
        <Heading as="h4" fontSize={['5.797101449vw', null, '3.125vw', '2.419354839vw']} fontWeight={400} lineHeight={[1.4, null, 1.291666667]} m={0} p={0}>{person.fullName}</Heading>
        <Heading as="h6" fontSize={['4.347826087vw', null, '2.083333333vw', '1.612903226vw', '1.142857143vw']} fontWeight={300} lineHeight={[1.4, null, 1.291666667]} m={0} mt={1} p={0}>{person.title}</Heading>
      </figcaption>
    </Box>
  );
}

export default PersonPreview;

const FigureContainer = styled.figure`
  position: relative;
  padding-bottom: 133.3333333%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
