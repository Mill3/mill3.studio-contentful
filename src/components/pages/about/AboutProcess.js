import React from 'react';
import { Box } from 'rebass'
import PersonPreview from '@components/persons/PersonPreview';

import { AboutSectionContainer } from './index'

const AboutProcess = ({ data, color }) => {
  console.log('data:', data)
  return (
    <Box as={AboutSectionContainer} color={color}>About Process</Box>
  );
}

export default AboutProcess;