import React from 'react';
import styled from 'styled-components'
import { Box, Heading } from 'rebass'

const PersonPreview = ({ person }) => {
  console.log('person:', person)
  return (
    <Box>
      <Box as={FigureContainer} mb={3}>
        <img srcSet={person.photo.fluid.srcSet} alt={person.fullname} class="img-fluid" />
      </Box>
      <figcaption>
        <Heading as="h4" fontSize={24} fontWeight={400} mb={2}>{person.fullName}</Heading>
        <Heading as="h6" fontSize={12} fontWeight={400}>{person.title}</Heading>
      </figcaption>
    </Box>
  );
}

export default PersonPreview;

const FigureContainer = styled.figure`
  position: relative;
  padding-bottom: 100%;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`