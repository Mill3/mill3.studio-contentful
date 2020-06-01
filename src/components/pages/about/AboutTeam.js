import React from 'react';
import { Box } from 'rebass'

import PersonPreview from '@components/persons/PersonPreview';

import { AboutSectionContainer } from './index'

const AboutTeam = ({ data, color }) => {
  return (
    <Box as={AboutSectionContainer} color={color}>
      About Team
    </Box>
  );
}

export default AboutTeam;