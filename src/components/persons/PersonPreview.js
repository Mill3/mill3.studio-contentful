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
        <Heading as="h4" fontSize={24} fontWeight={400} lineHeight={1.291666667} m={0} mb={2} p={0}>{person.fullName}</Heading>
        <Heading as="h6" fontSize={12} fontWeight={400} lineHeight={1.291666667} m={0} p={0}>{person.title}</Heading>
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
