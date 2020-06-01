import React from 'react';
import { Box } from 'rebass'

import PersonPreview from '@components/persons/PersonPreview';

import { AboutSectionContainer } from './index'

const AboutServices = ({ data, color }) => {
  console.log('data:', data)
  return (
    <Box as={AboutSectionContainer} color={color}>About Services</Box>
  );
}

export default AboutServices;
